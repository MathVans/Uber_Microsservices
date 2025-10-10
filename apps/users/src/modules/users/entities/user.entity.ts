import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types, UuidSchemaDefinition } from "mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({
        type: Types.ObjectId,
        default: () => new Types.ObjectId(),
        unique: true,
    })
    id: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
