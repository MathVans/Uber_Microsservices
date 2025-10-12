import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types, UuidSchemaDefinition } from "mongoose";
import * as bcrypt from "bcrypt";
import { JwtToken } from "apps/users/src/shared/common/interfaces/jwt-token.interface";
import { Role } from "apps/users/src/shared/common/enum/role.enum";

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

    @Prop({
        required: true,
        type: String,
        enum: Object.values(Role),
    })
    role: Role;

    @Prop({ required: true, select: false })
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (err) {
        return next(err as Error);
    }
});
