import { EntityRepository } from '@mikro-orm/postgresql';

import { TaskEntity } from '../entity/task.entity';
import { ITask } from 'src/tasks/types/task';
import { EntityData } from '@mikro-orm/core';
import { UserEntity } from '../entity/user.entity';

export class TasksRepo extends EntityRepository<TaskEntity> {
  async upsert(data: EntityData<TaskEntity>): Promise<TaskEntity> {
    const entity =
      (await this.findOne({ publicId: data.publicId })) || new TaskEntity();

    this.assign(entity, data);

    await this.getEntityManager().persist(entity).flush();

    return entity;
  }

  async toEntity(data: ITask): Promise<EntityData<TaskEntity>> {
    const entity: EntityData<TaskEntity> = {
      title: data.title,
      completedAt: data.completedAt,
      createdAt: data.createdAt,
      cost: data.cost,
      description: data.description,
      publicId: data.publicId,
      reward: data.reward,
      updatedAt: data.updatedAt,
    };

    const usersRepo = this.getEntityManager().getRepository(UserEntity);

    if (data.executor) {
      entity.executor = await usersRepo.findOne({ publicId: data.executor });
    }

    if (data.creator) {
      entity.creator = await usersRepo.findOne({ publicId: data.creator });
    }

    return entity;
  }
}
