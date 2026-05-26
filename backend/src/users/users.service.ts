import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { UserIcon } from './users.enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) { }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findById(id: UserEntity['id']) {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async findByEmail(email: UserEntity['email']) {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(createUserDto.password, salt);

    const userEntity = await this.usersRepository.findOne({ where: { email: createUserDto.email } });

    if (userEntity) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: 'emailAlreadyExists',
        },
      });
    }

    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const defaultIcon = UserIcon.CIRCLE;

    return this.usersRepository.save({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      password: password,
      color: randomColor,
      icon: defaultIcon,
    });
  }

  async update(id: UserEntity['id'], updateUserDto: UpdateUserDto) {
    const userPreload = await this.usersRepository.preload({
      id,
      lastName: updateUserDto.lastName,
      firstName: updateUserDto.firstName,
      ...(updateUserDto.color !== undefined && { color: updateUserDto.color }),
      ...(updateUserDto.icon  !== undefined && { icon:  updateUserDto.icon  }),
    });

    if (!userPreload) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: 'notFound',
        },
      });
    }

    if (updateUserDto.password && updateUserDto.newPassword) {
      const validPassword = await bcrypt.compare(updateUserDto.password, userPreload.password);

      if (!validPassword) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: 'invalidPassword',
          },
        });
      }
      const salt = await bcrypt.genSalt();
      userPreload.password = await bcrypt.hash(updateUserDto.newPassword, salt);
    }

    if (updateUserDto.email) {
      const otherUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email }
      });

      if (otherUser && otherUser.id !== id) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        });
      }

      userPreload.email = updateUserDto.email;
    }

    return await this.usersRepository.save(userPreload);
  }
  async delete(id: UserEntity['id']) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: { id: 'notFound' },
      });
    }
    await this.usersRepository.remove(user);
  }
}
