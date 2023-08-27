import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class GetUserResponseDTO {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  login: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  role: string;

  @ApiProperty()
  @IsDateString()
  createdAt: Date = new Date();

  @ApiProperty()
  @IsDateString()
  updatedAt: Date = new Date();

  @ApiProperty()
  @IsDateString()
  deletedAt: Date | null;
}
