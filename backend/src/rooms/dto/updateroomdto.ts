import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsOptional, MinLength } from 'class-validator';

@InputType()
export class UpdateRoomDto {
  @Field()
  @IsString()
  @MinLength(3)
  name!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;
}