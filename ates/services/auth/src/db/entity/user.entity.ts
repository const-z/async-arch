import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core';

import { UsersRepo } from '../repository/users.repo';
import { RoleEntity } from './role.entity';

@Entity({
  tableName: 'users',
  customRepository: () => UsersRepo,
})
export class UserEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @Property()
  login: string;

  @Property({ hidden: true })
  password: string;

  @Property()
  name: string;

  @Property()
  email: string;

  @Property({ fieldName: 'created_at' })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updated_at', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @ManyToOne(() => RoleEntity, { nullable: false })
  role: RoleEntity;
}
