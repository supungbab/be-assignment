import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  // UseInterceptors,
} from '@nestjs/common';
import { SurveyService } from './survey.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { SurveyData } from './dto/participate-survey.dto';
// import { TransactionInterceptor } from 'src/custom/transaction.interceptor';
// import { TransactionManager } from 'src/custom/transaction.dacorator';

import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ResponseSurvey,
  ResponseSurveyDistribution,
  ResponseSurveyNotData,
  SurveyDto,
} from './dto/survey.dto';

@ApiTags('Survey') // swagger에 tag를 생성해줌
@ApiResponse({ status: 403, description: 'Forbidden' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
// status 200에 대한 response 표시를 제공
@ApiOkResponse({ description: 'Success' })
@Controller('survey')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @ApiOperation({ summary: '설문 생성' }) // api 설명
  @ApiBody({
    description: 'post swagger',
    type: CreateSurveyDto,
  })
  @ApiOkResponse({
    description: 'Success',
    type: ResponseSurvey,
  })
  @Post()
  async createSurvey(@Body() createSurveyDto: CreateSurveyDto) {
    return await this.surveyService.createSurvey(createSurveyDto);
  }

  @ApiOperation({ summary: '설문 리스트' })
  @ApiOkResponse({
    description: 'Success',
    type: [SurveyDto],
  })
  @Get('list')
  async listSurvey() {
    return await this.surveyService.listSurvey();
  }

  @ApiOperation({ summary: '설문 상세' })
  @Get(':id')
  async readSurvey(@Param('id') id: number): Promise<UpdateSurveyDto> {
    return await this.surveyService.readSurvey(id);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiBody({
    type: SurveyData,
  })
  @ApiOperation({ summary: '설문 참여' })
  @ApiOkResponse({
    description: 'Success',
    type: ResponseSurveyNotData,
  })
  @Post(':id/participate')
  async participateInSurvey(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() surveyData: SurveyData,
  ) {
    return await this.surveyService.participateInSurvey(req, id, surveyData);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '설문 통계' })
  @ApiOkResponse({
    description: 'Success',
    type: ResponseSurveyDistribution,
  })
  @Get(':id/getQuestionDistribution')
  async getQuestionDistribution(@Req() req: Request, @Param('id') id: number) {
    return await this.surveyService.getQuestionDistribution(req, id);
  }
}
