import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsEnum,
    IsLatitude,
    IsLongitude,
} from "class-validator";

export class PointDto {
    @IsEnum(["Point"], { message: 'O tipo deve ser "Point".' })
    type?: "Point";

    @IsArray()
    @ArrayMinSize(2)
    @ArrayMaxSize(2)
    coordinates?: [number, number];
}
