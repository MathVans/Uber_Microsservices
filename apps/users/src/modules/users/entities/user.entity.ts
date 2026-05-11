import { Role } from '@app/common/shared/enum/role.enum';
import { BeforeInsert, Column, Entity } from 'typeorm';
import { BaseModel } from '@app/common/shared/entities/base.model';
import * as bcrypt from 'bcrypt';

@Entity('user')
export class User extends BaseModel {
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 150 })
  email: string;

  @Column({ type: 'varchar', length: 50 })
  role: Role;

  @Column({ type: 'varchar', length: 150, select: false })
  password: string;

  @BeforeInsert()
  async encryptPassword() {
    if (!this.password) {
      return;
    }

    this.password = await bcrypt.hash(this.password, 10);
  }
}
