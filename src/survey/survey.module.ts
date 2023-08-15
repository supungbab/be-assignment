import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';
import { Choice } from './entities/choice.entity';
import { ConditionalChoice } from './entities/conditional-choice.entity';
import { Question } from './entities/question.entity';
import { Survey } from './entities/survey.entity';
import { UserAnswer } from './entities/user-answer.entity';
import { UserSurvey } from './entities/user-survey.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      Choice,
      ConditionalChoice,
      Question,
      Survey,
      UserAnswer,
      UserSurvey,
    ]),
  ],
  controllers: [SurveyController],
  providers: [SurveyService],
})
export class SurveyModule {}
