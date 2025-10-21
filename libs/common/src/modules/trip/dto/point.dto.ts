import { ApiProperty } from "@nestjs/swagger";
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
    type: "Point";

    @IsArray()
    @ArrayMinSize(2)
    @ArrayMaxSize(2)
    @IsLongitude({ message: "A primeira coordenada (Longitude) é inválida." })
    @IsLatitude({ message: "A segunda coordenada (Latitude) é inválida." })
    coordinates: [number, number];
}
