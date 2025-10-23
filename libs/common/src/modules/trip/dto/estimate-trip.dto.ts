import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, ValidateNested } from "class-validator";
import { PointDto } from "./point.dto";
import { TripTypeEnum } from "@app/common/shared/enum/trip-type.enum";

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
