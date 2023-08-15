import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { participateSurveyJson } from '../example-json/participate-survey-json';

export class Answer {
  @ApiProperty()
  @IsNumber()
  question_id: number;

  @ApiProperty()
  @IsNumber()
  choice_id: number;
}

export class SurveyData {
  @ApiProperty({ example: participateSurveyJson.answer, type: [Answer] })
  answer: Answer[];
}
