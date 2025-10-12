import { Body, Controller, Get, Patch } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Types } from "mongoose";
import { ParseObjectIdPipe } from "@nestjs/mongoose";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/me")
  findOne(@Body("id", ParseObjectIdPipe) id: Types.ObjectId) {
    return this.usersService.findOne(id);
  }

  @Patch("/me")
  update(
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }
}
