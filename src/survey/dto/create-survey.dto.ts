import { ApiProperty } from '@nestjs/swagger';
import { createSurveyJson } from '../example-json/create-survey-json';
import { IsString, IsNumber } from 'class-validator';

export class ConditionalChoice {
  @ApiProperty()
  @IsNumber()
  target_question: number;

  @ApiProperty()
  @IsNumber()
  specific_choice: number;

  @ApiProperty()
  @IsNumber()
  next_question: number;
}

export class ChoiceDto {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsNumber()
  order: number;
}

export class QuestionDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNumber()
  order: number;

  @ApiProperty({ type: [ChoiceDto] })
  choices: ChoiceDto[];
}

export class CreateSurveyDto {
  @ApiProperty({ example: createSurveyJson.title, description: '설문 제목' })
  @IsString()
  title: string;

  @ApiProperty({
    example: createSurveyJson.description,
    description: '설문 설명',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: createSurveyJson.max_participants,
    description: '설문 참여 제한 / 0 입력 시 제한 없음',
  })
  @IsNumber()
  max_participants: number;

  @ApiProperty({
    type: [QuestionDto],
    example: createSurveyJson.questions,
    description: '질문 리스트',
  })
  questions: QuestionDto[];

  @ApiProperty({
    type: [ConditionalChoice],
    example: createSurveyJson.conditional_choice,
    description: '특정 질문 선택 시 다음 질문 지정',
  })
  conditional_choice?: ConditionalChoice[];
}
