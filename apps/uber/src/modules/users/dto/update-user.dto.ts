import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsMongoId, IsNumber } from "class-validator";
import { Types } from "mongoose";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsMongoId({})
  id: Types.ObjectId;
}
