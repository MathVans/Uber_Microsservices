import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern("users.createUser")
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern("users.findAllUsers")
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern("users.findOneUser")
  findOne(@Payload() id: number) {
    return this.usersService.findOne(id);
  }

  @MessagePattern("users.updateUser")
  update(@Payload() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  @MessagePattern("users.removeUser")
  remove(@Payload() id: number) {
    return this.usersService.remove(id);
  }
}
