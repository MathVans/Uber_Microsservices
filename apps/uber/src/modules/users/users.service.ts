import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(@Inject("USERS_CLIENT") private userClient: ClientProxy) {
  }
  findOne(id: string) {
    console.log("🚀 ~ UsersService ~ findOne ~ id:", id);
    return this.userClient.send("users.findOne", id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userClient.send("users.update", { id, updateUserDto });
  }
}
