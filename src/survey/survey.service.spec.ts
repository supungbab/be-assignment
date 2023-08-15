import { Test, TestingModule } from '@nestjs/testing';
import { SurveyService } from './survey.service';
import { DataSource } from 'typeorm';
import { Survey } from './entities/survey.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Choice } from './entities/choice.entity';
import { ConditionalChoice } from './entities/conditional-choice.entity';
import { UserSurvey } from './entities/user-survey.entity';
import { UserAnswer } from './entities/user-answer.entity';
import { participateSurveyJson } from './example-json/participate-survey-json';
import {
  survey_data,
  conditional_choice_data,
  successReadSurvey,
} from './example-json/tc-json';

describe('SurveyService', () => {
  let service: SurveyService;
  let dataSource: DataSource;
  let surveyRepo: Repository<Survey>;
  let questionRepo: Repository<Question>;
  let choiceRepo: Repository<Choice>;
  let conditionalChoiceRepo: Repository<ConditionalChoice>;
  let userSurveyRepo: Repository<UserSurvey>;
  let userAnswerRepo: Repository<UserAnswer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyService,
        {
          provide: DataSource,
          useValue: {
            query: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Survey),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Question),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Choice),
          useValue: {},
        },
        {
          provide: getRepositoryToken(ConditionalChoice),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserSurvey),
          useValue: {},
        },
        {
          provide: getRepositoryToken(UserAnswer),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SurveyService>(SurveyService);
    dataSource = module.get<DataSource>(DataSource);
    surveyRepo = module.get<Repository<Survey>>(getRepositoryToken(Survey));
    questionRepo = module.get<Repository<Question>>(
      getRepositoryToken(Question),
    );
    choiceRepo = module.get<Repository<Choice>>(getRepositoryToken(Choice));
    conditionalChoiceRepo = module.get<Repository<ConditionalChoice>>(
      getRepositoryToken(ConditionalChoice),
    );
    userSurveyRepo = module.get<Repository<UserSurvey>>(
      getRepositoryToken(UserSurvey),
    );
    userAnswerRepo = module.get<Repository<UserAnswer>>(
      getRepositoryToken(UserAnswer),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('readSurvey', () => {
    const surveyId = 1; // 테스트 설문조사 ID

    it('정상적으로 변환 하는가.', async () => {
      const expectedResult = successReadSurvey;

      dataSource.query = jest.fn().mockResolvedValue(survey_data);
      conditionalChoiceRepo.find = jest
        .fn()
        .mockResolvedValue(conditional_choice_data);

      const result = await service.readSurvey(surveyId);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('participateInSurvey', () => {
    //
  });
});
