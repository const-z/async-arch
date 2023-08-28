import { Entity, Property, PrimaryKey } from '@mikro-orm/core';

import { UsersRepo } from '../repository/users.repo';

@Entity({
  tableName: 'users',
  customRepository: () => UsersRepo,
})
export class UserEntity {
  @PrimaryKey({ autoincrement: true })
  id: number;

  @Property({ fieldName: 'public_id', type: 'uuid', unique: true })
  publicId: string;

  @Property()
  login: string;

  @Property()
  name: string;

  @Property()
  email: string;

  @Property()
  role: string;

  @Property({ fieldName: 'created_at' })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updated_at', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ fieldName: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
