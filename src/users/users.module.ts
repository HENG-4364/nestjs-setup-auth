import { Module } from '@nestjs/common';
import { User } from './entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserResolver } from './resolver/users.resolver';
import { FindOneServive } from './services/find-one.service';
import { UsersServive } from './services/users.service';
import { CreateUserService } from './services/create.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersServive, UserResolver, FindOneServive, CreateUserService],
})
export class UsersModule {}
