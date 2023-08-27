import { Entity, Property, PrimaryKey, ManyToOne, Enum } from '@mikro-orm/core';

import { TasksRepo } from '../repository/tasks.repo';
import { UserEntity } from './user.entity';

@Entity({
  tableName: 'tasks',
  customRepository: () => TasksRepo,
})
export class TaskEntity {
  @PrimaryKey({ autoincrement: true })
  id: number;

  @Property({ fieldName: 'public_id', type: 'uuid', unique: true })
  publicId: string;

  @Property()
  title: string;

  @Property()
  description: string;

  @Property()
  cost: number;

  @Property()
  reward: number;

  @ManyToOne(() => UserEntity, { nullable: false, eager: true })
  creator: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: false, eager: true })
  executor: UserEntity;

  @Property({ fieldName: 'completed_at', nullable: true })
  completedAt: Date;

  @Property({ fieldName: 'created_at' })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updated_at', onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
