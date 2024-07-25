import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginResponse {
  @Field(() => String, { nullable: true })
  accessToken: string;

  @Field(() => String, { nullable: true })
  refreshToken: string;
}

@ObjectType()
export class RefreshTokenResponse {
  @Field(() => String, { nullable: true })
  accessToken: string;
}
