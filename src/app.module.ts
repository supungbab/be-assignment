import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { SurveyModule } from './survey/survey.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    SurveyModule,
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.dev'],
    }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
      // entities: [__dirname + '/../**/*.entity.{js,ts}'],
      autoLoadEntities: true, // 프로젝트 내에 있는 entity를 자동으로 스캔해서 사용할지 설정
      synchronize: process.env.NODE_ENV === 'development', // DB 동기화 설정
      retryAttempts: 10, // DB 연결 시도 횟수
      logging: process.env.NODE_ENV === 'development',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
