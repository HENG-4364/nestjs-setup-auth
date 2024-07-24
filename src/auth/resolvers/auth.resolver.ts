import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from '../auth.service';
import { LoginInput } from '../dto/input/login.input';
import { LoginResponse } from '../dto/response/login.response';
import { UserResponse } from 'src/users/dto/resonse/user.response';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse)
  async login(@Args('input') input: LoginInput) {
    return await this.authService.login(input);
  }
  @Query(() => UserResponse)
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: UserResponse) {
    return user;
  }
}
