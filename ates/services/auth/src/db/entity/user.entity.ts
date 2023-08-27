import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core';

import { UsersRepo } from '../repository/users.repo';
import { RoleEntity } from './role.entity';

@Entity({
  tableName: 'users',
  customRepository: () => UsersRepo,
})
export class UserEntity {
  @PrimaryKey({ autoincrement: true })
  id: number;

  @Property({
    fieldName: 'public_id',
    type: 'uuid',
    defaultRaw: 'uuid_generate_v4()',
  })
  publicId: string;

  @Property()
  login: string;

  @Property({ hidden: true, lazy: true })
  password: string;

  @Property()
  name: string;

  @Property()
  email: string;

  @ManyToOne(() => RoleEntity, { nullable: false, eager: true })
  role: RoleEntity;

  @Property({ fieldName: 'created_at' })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updated_at', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ fieldName: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
