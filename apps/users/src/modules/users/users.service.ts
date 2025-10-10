import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserDTO } from "./dto/user.dto";

@Injectable()
export class UsersService {
  private users: UserDTO[] = [{
    id: 1,
    email: "MockData@gmail.com",
    password: "MockData123@",
    name: "Mocked User 1",
  }, {
    id: 2,
    email: "MockData@gmail.com",
    password: "MockData123@",
    name: "Mocked User 2",
  }, {
    id: 3,
    email: "MockData@gmail.com",
    password: "MockData123@",
    name: "Mocked User 3",
  }];

  create(createUserDto: CreateUserDto) {
    const newUser: UserDTO = {
      ...createUserDto,
      id: this.users.length + 1,
    };

    this.users.push(newUser);
    return newUser;
  }

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    return this.users.find((user) => (user.id = id));
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
