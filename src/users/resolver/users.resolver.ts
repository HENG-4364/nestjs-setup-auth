import { Args, Query, Resolver } from '@nestjs/graphql';
import { UsersServive } from '../users.service';
import { UserResponse, UsersResponse } from '../dto/resonse/user.response';
import { User } from '../entities/users.entity';
import { FindOneServive } from '../services/find-one.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UsersServive,
    private readonly findOneService: FindOneServive,
  ) {}

  @Query(() => UsersResponse, { name: 'users' })
  async findAll(): Promise<UsersResponse> {
    return await this.userService.findAll();
  }

  @Query(() => UserResponse, { name: 'user', nullable: true })
  async findOne(@Args('id', { type: () => String }) id: string) {
    return this.findOneService.findOne(id);
  }
}
