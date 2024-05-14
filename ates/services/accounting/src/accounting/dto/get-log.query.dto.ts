import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class GetLogQueryParams {
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  date?: Date;
}
