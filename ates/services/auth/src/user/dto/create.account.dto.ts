import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsEmail, IsString } from 'class-validator';

export class CreateUserRequestDTO {
  @IsString()
  @ApiProperty()
  readonly login: string;

  @IsString()
  @ApiProperty()
  readonly password: string;

  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsEmail()
  @ApiProperty()
  readonly email: string;

  @IsAlphanumeric()
  @ApiProperty()
  readonly role: string;
}
