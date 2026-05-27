import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { UserIcon } from './users.enums';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserDto {
  @Field()
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  firstName: string;

  @Field()
  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  lastName: string;

  @Field()
  @ApiProperty({ example: 'test1@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @ApiProperty()
  @MinLength(6)
  password: string;
}

@InputType()
export class UpdateUserDto {
  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'test1@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @Field({ nullable: true })
  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(6)
  newPassword?: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  firstName?: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  lastName?: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: '#ff0000' })
  @IsOptional()
  color?: string;

  @Field({ nullable: true })
  @ApiPropertyOptional({ example: UserIcon.CIRCLE })
  @IsOptional()
  icon?: UserIcon;
}
