import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext) {
    // 로그인 서버에서 로그인을 했다고 가정하고 client 에 jwt token 이 있다고 가정한다.
    // 편의상 복호화한 코드가 <Users> id(auth incr) 값 이라고 가정한다.

    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (authorization) {
      const [scheme, token] = authorization.split(' ');

      const id = Number(token);

      if (id) {
        // 유저 정보를 가져옵니다.
        const user = await this.usersService.findOne(id);

        // 유저 확인 로직을 추가합니다.
        if (user) {
          // request 객체에 유저 정보를 첨부하여 다음 컨트롤러에서 사용할 수 있도록 합니다.
          request.user = user;
          return true;
        }
      }
    }

    throw new UnauthorizedException('login 해주세요.');
  }
}
