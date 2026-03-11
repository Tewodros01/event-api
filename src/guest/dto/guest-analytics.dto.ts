import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class GuestAnalyticsDto {
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @Type(() => Number)
  total: number = 0;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @Type(() => Number)
  accepted: number = 0;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @Type(() => Number)
  declined: number = 0;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @Type(() => Number)
  pending: number = 0;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @Type(() => Number)
  maybe: number = 0;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  @Type(() => Number)
  acceptanceRate: number = 0;
}
