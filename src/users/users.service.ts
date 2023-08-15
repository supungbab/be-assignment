import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private user: Repository<User>,
  ) {}
  async findOne(id: number) {
    return await this.user.findOne({ where: { id } });
  }
}
