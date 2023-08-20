import { Entity, Property, PrimaryKey } from '@mikro-orm/core';

import { RolesRepo } from '../repository/roles.repo';

@Entity({
  tableName: 'roles',
  customRepository: () => RolesRepo,
})
export class RoleEntity {
  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  @Property({ fieldName: 'created_at' })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updated_at', onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
