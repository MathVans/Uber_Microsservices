import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { PointDto } from "./point.dto";

export class EstimateTripDto {
    @ValidateNested()
    @Type(() => PointDto)
    @IsNotEmpty()
    startLocation: PointDto;

    @ValidateNested()
    @Type(() => PointDto)
    @IsNotEmpty()
    endLocation: PointDto;
}
