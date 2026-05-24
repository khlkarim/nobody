import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UpdateUserDto } from './users.dto';

import {
  ApiParam,
  ApiOkResponse,
} from '@nestjs/swagger';

import { UserEntity } from './users.entity';
import { UsersService } from './users.service';

@Controller({ path: 'users' })
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: [UserEntity] })
  async findAll() {
    return await this.usersService.findAll();
  }

  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({ type: UserEntity })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: UserEntity['id']) {
    return await this.usersService.findById(id);
  }

  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({ type: UserEntity })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: UserEntity['id'], @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }
}
