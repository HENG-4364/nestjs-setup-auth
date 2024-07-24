import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserInput } from '../dto/input/create.input';
import * as bcrypt from 'bcrypt';
import { UserResponse } from '../dto/resonse/user.response';
@Injectable()
export class CreateUserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(input: CreateUserInput): Promise<UserResponse> {
    const { email, password } = input;
    const findUser = await this.userRepository.findOne({ where: { email } });

    if (findUser) {
      throw new BadRequestException('User with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userRepository.save({
      ...input,
      password: hashedPassword,
    });

    return {
      data: newUser,
    };
  }
}
