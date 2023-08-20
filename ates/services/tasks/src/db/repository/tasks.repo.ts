import { EntityRepository } from '@mikro-orm/postgresql';

import { TaskEntity } from '../entity/task.entity';
import { ITask } from 'src/tasks/types/task';
import { EntityData } from '@mikro-orm/core';

export class TasksRepo extends EntityRepository<TaskEntity> {
  async generatePublicId(): Promise<string> {
    const [result] = await this.em.execute<{ id: string }[]>(
      'SELECT uuid_generate_v4() AS id',
    );

    return result.id;
  }

  async createTask(data: EntityData<TaskEntity>): Promise<TaskEntity> {
    const publicId = await this.generatePublicId();
    const entity = this.create(data);
    this.assign(entity, { ...data, publicId });
    await this.getEntityManager().persistAndFlush(entity);

    return entity;
  }

  async getTasksView(): Promise<any> {
    const tasks = await this.getTasksViewQuery();

    return tasks;
  }

  private getTasksViewQuery() {
    return this.em
      .getKnex()
      .from('tasks AS t')
      .select<ITask[]>(
        't.id',
        't.public_id AS publicId',
        't.title',
        't.description',
        't.cost',
        't.reward',
        'creator.public_id as creator',
        'executor.public_id as executor',
        't.created_at AS createdAt',
        't.updated_at AS updatedAt',
        't.completed_at AS completedAt',
      )
      .join('users AS creator', 'creator.id', 't.creator')
      .join('users AS executor', 'executor.id', 't.executor');
  }
}
