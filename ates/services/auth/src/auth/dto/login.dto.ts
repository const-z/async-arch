import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class LoginRequestDTO {
  @ApiProperty()
  @IsDefined()
  @IsString()
  readonly login: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  readonly password: string;
}

export class LoginResponseDTO {
  @ApiProperty()
  @IsDefined()
  @IsString()
  readonly token: string;
}
