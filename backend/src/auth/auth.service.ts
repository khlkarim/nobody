import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, LoginDto } from './auth.dto';
import { CreateUserDto } from 'src/users/users.dto';
import { UsersService } from '../users/users.service';
import { AllConfigType } from 'src/config/config.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService<AllConfigType>,
  ) { }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: 'notFound',
        },
      });
    }

    const passwordIsValid = await bcrypt.compare(loginDto.password, user.password);

    if (!passwordIsValid) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: 'incorrectPassword',
        },
      });
    }

    const secret = this.configService.getOrThrow('auth.secret', { infer: true });
    const expiresIn = this.configService.getOrThrow<number>('auth.expiresIn', { infer: true });

    const token = await this.jwtService.signAsync(
      {
        id: user.id,
      },
      {
        secret,
        expiresIn,
      },
    );

    return {
      token,
      expiresIn,
    };
  }

  async register(dto: CreateUserDto) {
    return await this.usersService.create(dto);
  }

  async me(payload: JwtPayload) {
    return this.usersService.findById(payload.id);
  }
}
