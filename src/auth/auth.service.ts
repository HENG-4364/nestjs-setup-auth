import { Injectable, Logger } from '@nestjs/common';
import { LoginInput } from './dto/input/login.input';
import { GraphQLError } from 'graphql';
import { FindOneServive } from 'src/users/services/find-one.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger();
  constructor(
    private readonly findOneService: FindOneServive,
    private readonly jwtService: JwtService,
  ) {}

  async login(input: LoginInput): Promise<{ accessToken: string | null }> {
    try {
      const foundUser = await this.findOneService.findOneByEmail(input.email);

      if (!foundUser) {
        throw new GraphQLError(`Email does not exist`, {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }

      const isMatched = bcrypt.compareSync(
        input.password,
        foundUser.data.password,
      );

      if (!isMatched) {
        throw new GraphQLError(`Password does not match`, {
          extensions: {
            code: 'INVALID_PASSWORD',
          },
        });
      }
      const { data } = foundUser;

      const payload = { userId: data.id };

      const accessToken = this.jwtService.sign(payload);

      return {
        accessToken,
      };
    } catch (error) {
      this.logger.error(error);
      if (error instanceof GraphQLError) {
        throw error;
      } else {
        throw new GraphQLError('Internal Server Error', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
          },
        });
      }
    }
  }
}
