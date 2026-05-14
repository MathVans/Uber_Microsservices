import { ApiProperty } from '@nestjs/swagger';
import { TripStatus } from '@app/common/shared/enum/trip-status.enum';
import { IsIn } from 'class-validator';
export class TripResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  passengerId: string;

  @ApiProperty()
  driverId?: string;

  @ApiProperty({ enum: TripStatus })
  @IsIn(['requested', 'accepted', 'in_progress', 'completed', 'canceled'])
  status: string;

  @ApiProperty()
  estimatedPrice?: number;

  @ApiProperty()
  finalPrice?: number;

  @ApiProperty()
  createdAt: Date;
}
