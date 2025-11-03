import { Prop, Schema } from '@nestjs/mongoose';

@Schema({})
export class Point {
  @Prop({ type: String, enum: ['Point'], required: true })
  type: string;

  @Prop({ type: [Number], required: true })
  coordinates: number[];
}
