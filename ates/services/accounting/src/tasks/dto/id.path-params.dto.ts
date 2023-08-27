import { Transform } from 'class-transformer';
import { IsDefined, IsNumber, IsNumberString } from 'class-validator';

export class IdPathParams {
  @IsDefined()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  id: number;
}
