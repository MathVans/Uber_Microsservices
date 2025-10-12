import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsString, isString } from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  id: string;
}
