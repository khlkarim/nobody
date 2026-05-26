import { IsString, IsOptional, IsUUID, MinLength } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  creatorId!: string;
}

export class JoinRoomDto {
  @IsUUID()
  userId!: string;
}