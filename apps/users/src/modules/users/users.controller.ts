import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Types } from "mongoose";
import { User } from "./entities/user.entity";
import { UserResponseDto } from "../../shared/common/dto/user-response.dto";

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern("users.findOne")
  findOne(@Payload() id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @MessagePattern("users.update")
  update(@Payload() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(updateUserDto);
  }
}
