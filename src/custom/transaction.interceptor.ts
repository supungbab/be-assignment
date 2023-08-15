import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DataSource } from 'typeorm';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const request = context.switchToHttp().getRequest();
    request.queryRunnerManager = queryRunner.manager;

    return next.handle().pipe(
      catchError(async (error) => {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();

        if (error instanceof HttpException) {
          throw new HttpException(error.getResponse(), error.getStatus());
        }
        throw new InternalServerErrorException();
      }),
      tap(async () => {
        await queryRunner.commitTransaction();
        await queryRunner.release();
      }),
    );
  }
}
