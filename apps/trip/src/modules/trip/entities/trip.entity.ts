import { TripStatus } from "@app/common/shared/enum/trip-status.enum";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Point } from "./point";

@Schema({ timestamps: true })
export class Trip {
    @Prop({ type: Point, required: true })
    startLocation: Point;

    @Prop({ type: Point, required: true })
    endLocation: Point;

    @Prop({ required: true })
    passengerId: string;

    @Prop({ required: false })
    driverId: string;

    @Prop({ required: false, type: String, enum: Object.values(TripStatus) })
    status: TripStatus;

    @Prop({ required: false })
    estimatedPrice: number;

    @Prop({ required: false })
    finalPrice: number;

    createdAt: Date;
    updatedAt: Date;
}

export type TripDocument = Trip & Document;
export const TripSchema = SchemaFactory.createForClass(Trip);

TripSchema.index({ startLocation: "2dsphere" });
TripSchema.set("toJSON", {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});
