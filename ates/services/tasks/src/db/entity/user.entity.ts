import { Entity, Property, PrimaryKey } from '@mikro-orm/core';

import { UsersRepo } from '../repository/users.repo';

@Entity({
  tableName: 'users',
  customRepository: () => UsersRepo,
})
export class UserEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string;

  @Property()
  login: string;

  @Property()
  name: string;

  @Property()
  email: string;

  @Property({ type: 'json', nullable: false })
  role: { id: number; name: string };

  @Property({ fieldName: 'created_at' })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updated_at', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ fieldName: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @Property({ fieldName: 'blocked_at', nullable: true })
  blockedAt: Date | null;
}
