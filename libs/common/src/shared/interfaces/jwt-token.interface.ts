import { Types } from "mongoose";
import { Role } from "../enum/role.enum";

export interface JwtToken {
    accessToken: string;
    name: string;
    email: string;
    role: Role;
    id: Types.ObjectId;
}
