import { Field, InputType } from '@nestjs/graphql/dist/decorators/index.js';
import { IsString, IsOptional, IsUUID, MinLength } from 'class-validator';

@InputType()
export class CreateRoomDto {
  @Field()
  @IsString()
  @MinLength(1)
  name!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field()
  @IsUUID()
  creatorId!: string;
}

export class JoinRoomDto {
  @IsUUID()
  userId!: string;
}