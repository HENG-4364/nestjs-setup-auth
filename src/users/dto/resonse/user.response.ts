import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Users {
  @Field(() => String)
  id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;
  @Field()
  gender: string;

  @Field()
  password: string;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;
}
@ObjectType()
export class UserResponse {
  @Field(() => Users)
  data: Users;
}
@ObjectType()
export class UsersResponse {
  @Field(() => [Users])
  data: Users[];
}
