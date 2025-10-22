import { ApiProperty } from "@nestjs/swagger";
import { PointDto } from "./point.dto"; // Reutilize o DTO do Point

export class TripResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    passengerId: string;

    @ApiProperty()
    driverId?: string;

    @ApiProperty()
    status: string;

    @ApiProperty()
    startLocation: PointDto;

    @ApiProperty()
    endLocation: PointDto;

    @ApiProperty()
    createdAt: string;
}
