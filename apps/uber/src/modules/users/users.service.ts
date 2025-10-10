import { Inject, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class UsersService {
  constructor(@Inject("USERS_CLIENT") private userClient: ClientProxy) {
  }
  create(data: any) {
    return this.userClient.send("users.Create", data);
  }

  findAll() {
    return this.userClient.send("users.findAll", {});
  }

  findOne(id: number) {
    return this.userClient.send("users.findOne", id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
