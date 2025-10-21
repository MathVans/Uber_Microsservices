import { IsMongoId, IsNotEmpty, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { PointDto } from "./point.dto";

export class CreateTripDto {
    @IsMongoId({ message: "O ID do passageiro é inválido." })
    @IsNotEmpty({ message: "O ID do passageiro é obrigatório." })
    passengerId: string;

    @ValidateNested()
    @Type(() => PointDto)
    @IsNotEmpty()
    startLocation: PointDto;

    @ValidateNested()
    @Type(() => PointDto)
    @IsNotEmpty()
    endLocation: PointDto;
}
