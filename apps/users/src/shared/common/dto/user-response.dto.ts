import { Types } from "mongoose";

export class UserResponseDto {
    id: Types.ObjectId;
    name: string;
    email: string;
    role: string;
}
