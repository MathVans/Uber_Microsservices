import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';

export class EstimateTripDto {
  @IsNotEmpty()
  origin: string;

  @IsNotEmpty()
  destination: string;
}
