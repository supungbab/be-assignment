import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Survey } from './entities/survey.entity';
import { Question } from './entities/question.entity';
import { Choice } from './entities/choice.entity';
import { ConditionalChoice } from './entities/conditional-choice.entity';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { GENDER_AND_AGE, READ_SURVEY } from './queries/survey.query';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { SurveyData } from './dto/participate-survey.dto';
import { UserSurvey } from './entities/user-survey.entity';
import { UserAnswer } from './entities/user-answer.entity';

export interface RequestWithUser extends Request {
  user?: {
    id: number;
    name: string;
    birth: string;
    gender: string;
  };
}

@Injectable()
export class SurveyService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectRepository(Survey)
    private surveyRepo: Repository<Survey>,
    @InjectRepository(Question)
    private questionRepo: Repository<Question>,
    @InjectRepository(Choice)
    private choiceRepo: Repository<Choice>,
    @InjectRepository(ConditionalChoice)
    private conditionalChoiceRepo: Repository<ConditionalChoice>,
    @InjectRepository(UserSurvey)
    private userSurveyRepo: Repository<UserSurvey>,
    @InjectRepository(UserAnswer)
    private userAnswerRepo: Repository<UserAnswer>,
  ) {}

  // 생성 api
  async createSurvey(createSurveyDto: CreateSurveyDto) {
    // console.log(createSurveyDto);
    const {
      title,
      description,
      max_participants,
      questions,
      conditional_choice,
    } = createSurveyDto;

    // db가 정규화가 되어있기 때문에 트랜잭션을 걸어 무결성을 보장한다.
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');

    try {
      const { id: survey_id } = await queryRunner.manager.save(Survey, {
        title,
        description,
        max_participants,
      });

      for (const question of questions) {
        const { id: question_id } = await queryRunner.manager.save(Question, {
          survey_id,
          title: question.title,
          order: question.order,
        });

        const a = await queryRunner.manager.save(
          Choice,
          question.choices.map((e) => ({
            question_id,
            ...e,
          })),
        );
        console.log(a);
      }

      await queryRunner.manager.save(
        ConditionalChoice,
        conditional_choice.map((e) => ({
          survey_id,
          target_question: e.target_question,
          specific_choice: e.specific_choice,
          next_question: e.next_question,
        })),
      );
      // 모든 동작이 정상적으로 수행되었을 경우 커밋을 수행한다.
      await queryRunner.commitTransaction();
      return {
        success: true,
        id: survey_id,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return {
        success: false,
        message: error.message,
      };
    } finally {
      await queryRunner.release();
    }
  }

  // 설문 리스트 api
  async listSurvey(): Promise<Survey[]> {
    // TODO page limit
    try {
      return this.surveyRepo.find();
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  // 설문 상세 api
  async readSurvey(id: number): Promise<UpdateSurveyDto> {
    const survey_data = await this.dataSource.query(READ_SURVEY, [id]);
    // console.log(survey_data);
    const conditional_choice = await this.conditionalChoiceRepo.find({
      where: { survey_id: id },
    });
    // console.log(conditional_choice);

    // survey 키 값 기준 object 화
    const surveyObj = survey_data.reduce(
      (obj, row) => {
        obj.id = row.id;
        obj.title = row.title;
        obj.description = row.description;
        obj.max_participants = row.max_participants;
        obj.now_participants = row.now_participants;
        // 질문 오브젝트
        obj.questions[row.question_id] = obj.questions[row.question_id] || {
          id: row.question_id,
          title: row.question_title,
          order: row.question_order,
          choices: [],
        };
        obj.questions[row.question_id].choices.push({
          id: row.choice_id,
          content: row.choice_content,
          order: row.choice_order,
        });
        return obj;
      },
      {
        id,
        title: '',
        description: '',
        max_participants: 0,
        now_participants: 0,
        questions: {},
      },
    );

    const survey: UpdateSurveyDto = {
      id: surveyObj.id,
      title: surveyObj.title,
      description: surveyObj.description,
      max_participants: surveyObj.max_participants,
      now_participants: surveyObj.now_participants,
      questions: Object.values(surveyObj.questions),
      conditional_choice: conditional_choice.map((row) => ({
        id: row.id,
        target_question: row.target_question,
        specific_choice: row.specific_choice,
        next_question: row.next_question,
      })),
    };

    return survey;
  }

  // 설문 수정 api
  async updateSurvey() {}

  // 설문 삭제 api
  async deleteSurvey() {}

  // 참여 api
  async participateInSurvey(
    req: RequestWithUser | any,
    id: number,
    surveyData: SurveyData,
  ) {
    const { id: user_id } = req.user;

    // 현재 설문에 있는 id 인지 더블 체크하기 위해 불러온다.
    const readSurveyData: UpdateSurveyDto = await this.readSurvey(id);

    const questionsIds = [];
    const choicesIds = [];
    readSurveyData.questions.forEach((q) => {
      questionsIds.push(q.id);
      q.choices.forEach((c) => choicesIds.push(c.id));
    });

    // 질문 선택지가 없으면 에러
    const check = surveyData.answer.some(
      (row) =>
        !questionsIds.includes(row.question_id) ||
        !choicesIds.includes(row.choice_id),
    );
    if (check) {
      return {
        success: false,
        message: '질문 및 질문 선택지 ID 가 존재하지 않습니다.',
      };
    }

    const queryRunner = this.dataSource.createQueryRunner();

    // 동시성 문제를 해소하기 위한 트랜잭션.
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');

    try {
      // 1. 이미 진행한 설문인지 확인.
      const userSurveyData: UserSurvey = await queryRunner.manager.findOne(
        UserSurvey,
        {
          where: {
            user_id,
            survey_id: id,
          },
        },
      );
      // 2-1. 진행 설문일 시 에러 반환.
      if (userSurveyData?.id) {
        await queryRunner.commitTransaction();
        return {
          success: false,
          message: '이미 진행한 설문 입니다.',
        };
      }
      // 2-2. 인원 제한 확인
      const checkSurvey = await queryRunner.manager.findOne(Survey, {
        select: {
          max_participants: true,
          now_participants: true,
        },
        where: { id },
      });

      // max_participants 가 0일 시 인원 제한을 두지 않는다.
      if (checkSurvey.max_participants) {
        if (checkSurvey.max_participants <= checkSurvey.now_participants) {
          await queryRunner.commitTransaction();
          return {
            success: false,
            message: '이미 마감된 설문 입니다.',
          };
        }
      }

      // 3. 미진행 설문일 시 정상 insert.
      await queryRunner.manager.update(
        Survey,
        { id },
        { now_participants: checkSurvey.now_participants + 1 },
      );

      const createdUserSurvey = await queryRunner.manager.save(UserSurvey, {
        survey_id: id,
        user_id,
      });

      await queryRunner.manager.save(
        UserAnswer,
        surveyData.answer.map(
          (row): UserAnswer => ({
            user_survey_id: createdUserSurvey.id,
            question_id: row.question_id,
            choice_id: row.choice_id,
          }),
        ),
      );
      // 모든 동작이 정상적으로 수행되었을 경우 커밋을 수행한다.
      await queryRunner.commitTransaction();
      return {
        success: true,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return {
        success: false,
        message: error.message,
      };
    } finally {
      await queryRunner.release();
    }
  }

  // 설문 통계
  async getQuestionDistribution(req: RequestWithUser, id: number) {
    const { id: user_id } = req.user;
    console.log(user_id);

    const checkJoinSurvey: UserSurvey = await this.userSurveyRepo.findOne({
      where: { user_id },
    });
    console.log(checkJoinSurvey);

    if (checkJoinSurvey?.id) {
      const results = await this.dataSource.query(GENDER_AND_AGE, [id]);
      return {
        success: true,
        results,
      };
    } else {
      return {
        success: false,
        message: '설문 이력이 없습니다.',
      };
    }
  }
}
