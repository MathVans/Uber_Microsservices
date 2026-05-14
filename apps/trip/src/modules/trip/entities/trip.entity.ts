import { BaseModel } from '@app/common/shared/entities/base.model';
import { TripStatus } from '@app/common/shared/enum/trip-status.enum';
import { Column, Entity, Index } from 'typeorm';

@Entity('trip')
@Index('idx_trip_passenger_id', ['passengerId'])
@Index('idx_trip_driver_id', ['driverId'])
@Index('idx_trip_status', ['status'])
export class Trip extends BaseModel {
  @Column({ type: 'text' })
  origin: string;

  @Column({ type: 'text' })
  destination: string;

  @Column({ type: 'int' })
  distanceInMeters: number;

  @Column({ type: 'int' })
  durationInSeconds: number;

  @Column({ type: 'varchar', length: 36 })
  passengerId: string;

  @Column({ type: 'varchar', length: 36, nullable: true })
  driverId?: string;

  @Column({ type: 'varchar', default: TripStatus.REQUESTED })
  status: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  estimatedPrice?: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  finalPrice?: number;
}
