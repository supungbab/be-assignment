import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SurveyDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  max_participants: number;

  @ApiProperty()
  now_participants: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class ResponseSurvey {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  id: number;
}

export class ResponseSurveyNotData {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;
}

export class QuestionResult {
  @ApiProperty()
  'survey_id': number;
  @ApiProperty()
  'question_id': number;
  @ApiProperty()
  'question_title': string;
  @ApiProperty()
  'choice_id': number;
  @ApiProperty()
  'choice_content': string;
  @ApiProperty()
  'total_responses': number;
  @ApiProperty()
  'women': number;
  @ApiProperty()
  'men': number;
  @ApiProperty()
  '10_age': number;
  @ApiProperty()
  '20_age': number;
  @ApiProperty()
  '30_age': number;
  @ApiProperty()
  '40_age': number;
  @ApiProperty()
  '50_age': number;
  @ApiProperty()
  '60_age_more': number;
}

export class ResponseSurveyDistribution {
  @ApiProperty()
  success: boolean;

  @ApiProperty({ type: [QuestionResult] })
  results: [QuestionResult];
}
