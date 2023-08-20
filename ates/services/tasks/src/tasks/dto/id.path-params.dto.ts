import { IsNumberString } from 'class-validator';

export class IdPathParams {
  @IsNumberString()
  id: number;
}
