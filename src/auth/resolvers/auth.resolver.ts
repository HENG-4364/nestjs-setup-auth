import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from '../auth.service';
import { LoginInput } from '../dto/input/login.input';
import {
  LoginResponse,
  RefreshTokenResponse,
} from '../dto/response/login.response';
import { UserResponse } from 'src/users/dto/resonse/user.response';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { Public, CurrentUser } from '../decorators';
import { RefreshTokenInput } from '../dto/input/refresh-token.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => LoginResponse)
  async login(@Args('input') input: LoginInput) {
    return await this.authService.login(input);
  }

  @Mutation(() => RefreshTokenResponse)
  async refreshToken(
    @Args('input') input: RefreshTokenInput,
  ): Promise<RefreshTokenResponse> {
    return {
      accessToken: await this.authService.refreshToken(input),
    };
  }

  @Query(() => UserResponse)
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: UserResponse) {
    return user;
  }
}
