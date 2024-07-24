import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GraphQLError } from 'graphql';
import { User } from '../entities/users.entity';
import { UserResponse } from '../dto/resonse/user.response';

@Injectable()
export class FindOneServive {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOne(id: string): Promise<UserResponse> {
    try {
      const users = await this.usersRepository.findOne({ where: { id } });
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
