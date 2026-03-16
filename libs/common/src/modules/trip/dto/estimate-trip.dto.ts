import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';

export class EstimateTripDto {
  @IsNotEmpty()
  origin: String;

  @IsNotEmpty()
  destination: String;
}
