import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class TripDto {
  @IsString({ message: 'O ID do passageiro é inválido.' })
  @IsNotEmpty({ message: 'O ID do passageiro é obrigatório.' })
  passengerId: string;

  @IsString({ message: 'O ID do passageiro é inválido.' })
  @IsOptional()
  driverId: string;

  @ValidateNested()
  @IsNotEmpty()
  origin: string;

  @ValidateNested()
  @IsNotEmpty()
  destination: string;

  @IsNotEmpty()
  @IsIn(['requested', 'accepted', 'in_progress', 'completed', 'canceled'])
  status: string;

  @IsNumber()
  @IsOptional()
  estimatedPrice: number;

  @IsNumber()
  @IsOptional()
  finalPrice;
}
