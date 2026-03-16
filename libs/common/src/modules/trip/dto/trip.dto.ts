import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TripStatus } from '@app/common/shared/enum/trip-status.enum';

export class TripDto {
  @IsMongoId({ message: 'O ID do passageiro é inválido.' })
  @IsNotEmpty({ message: 'O ID do passageiro é obrigatório.' })
  passengerId: string;

  @IsMongoId({ message: 'O ID do passageiro é inválido.' })
  @IsOptional()
  driverId: string;

  @ValidateNested()
  @IsNotEmpty()
  origin: String;

  @ValidateNested()
  @IsNotEmpty()
  destination: String;

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
