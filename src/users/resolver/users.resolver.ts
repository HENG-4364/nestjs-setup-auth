import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserResponse, UsersResponse } from '../dto/resonse/user.response';
import { User } from '../entities/users.entity';
import { FindOneServive } from '../services/find-one.service';
import { UsersServive } from '../services/users.service';
import { CreateUserService } from '../services/create.service';
import { CreateUserInput } from '../dto/input/create.input';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UsersServive,
    private readonly findOneService: FindOneServive,
    private readonly createUserService: CreateUserService,
  ) {}

  @Query(() => UsersResponse, { name: 'users' })
  async findAll(): Promise<UsersResponse> {
    return await this.userService.findAll();
  }

  @Query(() => UserResponse, { name: 'user', nullable: true })
  async findOne(@Args('id', { type: () => String }) id: string) {
    return this.findOneService.findOne(id);
  }
  @Mutation(() => UserResponse)
  async create(@Args('input') input: CreateUserInput): Promise<UserResponse> {
    return this.createUserService.create(input);
  }
}
