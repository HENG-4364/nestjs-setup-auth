import { Injectable, Logger } from '@nestjs/common';
import { LoginInput } from './dto/input/login.input';
import { GraphQLError } from 'graphql';
import { FindOneServive } from 'src/users/services/find-one.service';
import * as bcrypt from 'bcrypt';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { RefreshTokenInput } from './dto/input/refresh-token.input';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly findOneService: FindOneServive,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async refreshToken(input: RefreshTokenInput) {
    try {
      const payload = await this.jwtService.verifyAsync(input.refreshToken, {
        secret: this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
      });

      const { userId } = payload;
      const refreshPayload = { userId };
      const accesPayload = { userId };

      const accessToken = await this.jwtService.signAsync(accesPayload, {
        expiresIn: this.configService.getOrThrow<string>('ACCESS_TOKEN_EXP'),
        secret: this.configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
      });

      const refreshToken = this.jwtService.sign(refreshPayload, {
        expiresIn: this.configService.getOrThrow<string>('REFRESH_TOKEN_EXP'),
        secret: this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      this.logger.error(error);
      if (error instanceof GraphQLError) {
        throw error;
      } else if (error instanceof JsonWebTokenError) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        });
      } else {
        throw new GraphQLError('Internal Server Error', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
          },
        });
      }
    }
  }

  async login(
    input: LoginInput,
  ): Promise<{ accessToken: string | null; refreshToken: string | null }> {
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

      const refreshPayload = { userId: data.id };
      const accesPayload = { userId: data.id };
      const accessToken = await this.jwtService.signAsync(accesPayload, {
        expiresIn: this.configService.getOrThrow<string>('ACCESS_TOKEN_EXP'),
        secret: this.configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
      });

      const refreshToken = this.jwtService.sign(refreshPayload, {
        expiresIn: this.configService.getOrThrow<string>('REFRESH_TOKEN_EXP'),
        secret: this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
      });

      return {
        accessToken,
        refreshToken,
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
