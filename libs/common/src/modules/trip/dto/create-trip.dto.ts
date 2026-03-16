import { IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTripDto {
  @IsMongoId({ message: 'O ID do passageiro é inválido.' })
  @IsNotEmpty({ message: 'O ID do passageiro é obrigatório.' })
  passengerId: string;

  @Type(() => String)
  @IsNotEmpty()
  startLocation: String;

  @Type(() => String)
  @IsNotEmpty()
  endLocation: String;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  durationInSeconds: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  distanceInMeters: number;
}
