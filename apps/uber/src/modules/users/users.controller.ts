import { Body, Controller, Get, Param, Patch, Query } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { IdDto } from "../../shared/common/dto/Id-dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/me")
  findOne(@Body() idDto: IdDto) {
    return this.usersService.findOne(idDto.id);
  }

  @Patch("/me")
  update(
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(updateUserDto);
  }

  @Get("/:id")
  findById(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }
}
