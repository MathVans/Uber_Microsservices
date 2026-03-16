import { ApiProperty } from '@nestjs/swagger';
import { TripStatus } from '@app/common/shared/enum/trip-status.enum';
export class TripResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  passengerId: string;

  @ApiProperty()
  driverId?: string;

  @ApiProperty({ enum: TripStatus })
  status: TripStatus;

  @ApiProperty()
  estimatedPrice?: number;

  @ApiProperty()
  finalPrice?: number;

  @ApiProperty()
  createdAt: string;
}
