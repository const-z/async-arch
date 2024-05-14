import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core';

import { AccountLogRepo } from '../repository/account-log.repo';
import { TaskEntity } from './task.entity';
import { UserEntity } from './user.entity';

@Entity({
  tableName: 'account_log',
  customRepository: () => AccountLogRepo,
})
export class AccountLogEntity {
  @PrimaryKey({ autoincrement: true })
  id: number;

  @Property({ fieldName: 'public_id', type: 'uuid', unique: true })
  publicId: string;

  @ManyToOne(() => UserEntity, { nullable: false, eager: true })
  user: UserEntity;

  @ManyToOne(() => TaskEntity, { nullable: false, eager: true })
  task: UserEntity;

  @Property()
  amount: number;

  @Property()
  type: string;

  @Property({ fieldName: 'created_at' })
  createdAt: Date = new Date();
}
