import { ApiProperty } from "@nestjs/swagger";
import { PointDto } from "./point.dto";
import { TripStatus } from "@app/common/shared/enum/trip-status.enum";
export class TripResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    passengerId: string;

    @ApiProperty()
    driverId?: string;

    @ApiProperty()
    startLocation?: PointDto;

    @ApiProperty()
    endLocation?: PointDto;

    @ApiProperty({ enum: TripStatus })
    status: TripStatus;

    @ApiProperty()
    estimatedPrice?: number;

    @ApiProperty()
    finalPrice?: number;

    @ApiProperty()
    createdAt: string;
}
