import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTripDto {
  @IsString({ message: 'O ID do passageiro é inválido.' })
  @IsNotEmpty({ message: 'O ID do passageiro é obrigatório.' })
  passengerId: string;

  @Type(() => String)
  @IsNotEmpty()
  origin: string;

  @Type(() => String)
  @IsNotEmpty()
  destination: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  durationInSeconds: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  distanceInMeters: number;
}
