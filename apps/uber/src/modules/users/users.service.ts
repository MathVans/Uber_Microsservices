import { Inject, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ClientProxy } from "@nestjs/microservices";
import { Types } from "mongoose";

@Injectable()
export class UsersService {
  constructor(@Inject("USERS_CLIENT") private userClient: ClientProxy) {
  }
  findOne(id: Types.ObjectId) {
    return this.userClient.send("users.findOne", id);
  }

  update(id: Types.ObjectId, updateUserDto: UpdateUserDto) {
    return this.userClient.send("users.update", { id, updateUserDto });
  }
}
