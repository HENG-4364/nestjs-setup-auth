import { Module } from '@nestjs/common';
import { UsersServive } from './users.service';
import { User } from './entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserResolver } from './resolver/users.resolver';
import { FindOneServive } from './services/find-one.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersServive, UserResolver, FindOneServive],
})
export class UsersModule {}
