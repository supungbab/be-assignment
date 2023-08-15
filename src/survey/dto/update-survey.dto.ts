import { ApiProperty } from '@nestjs/swagger';

export class ConditionalChoice {
  @ApiProperty()
  id: number;

  @ApiProperty()
  target_question: number;

  @ApiProperty()
  specific_choice: number;

  @ApiProperty()
  next_question: number;
}

export class ChoiceDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  order: number;
}

export class QuestionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  order: number;

  @ApiProperty({ type: ChoiceDto })
  choices: ChoiceDto[];
}

export class UpdateSurveyDto {
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

  @ApiProperty({ type: QuestionDto })
  questions: QuestionDto[];

  @ApiProperty({ type: ConditionalChoice })
  conditional_choice?: ConditionalChoice[];
}
