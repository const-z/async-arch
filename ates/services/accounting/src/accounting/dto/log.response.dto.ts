import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator';

import { LogType } from '../types/account-log';

export class AccountLogRowDTO {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  publicId: string;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsEnum(LogType)
  type: string;

  @ApiProperty()
  @IsNumber()
  amount: number;
}

export class AccountLogResponseDTO {
  @ApiProperty({ isArray: true })
  @Type(() => AccountLogRowDTO)
  log: AccountLogRowDTO[];

  @ApiProperty()
  @IsNumber()
  summary: number;
}
