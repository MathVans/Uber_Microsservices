import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TripStatus } from '@app/common/shared/enum/trip-status.enum';

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

  @IsEnum(TripStatus)
  @IsNotEmpty()
  status: TripStatus;

  @IsNumber()
  @IsOptional()
  estimatedPrice: number;

  @IsNumber()
  @IsOptional()
  finalPrice;
}
