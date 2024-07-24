import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GraphQLError } from 'graphql';
import { UsersResponse } from './dto/resonse/user.response';
import { User } from './entities/users.entity';

@Injectable()
export class UsersServive {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<UsersResponse> {
    try {
      const users = await this.usersRepository.find();
      return {
        data: users,
      };
    } catch (error) {
      if (error instanceof GraphQLError) {
        throw error;
      } else {
        throw new GraphQLError('Internal server error', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
          },
        });
      }
    }
  }
}
