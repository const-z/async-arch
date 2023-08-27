import { EntityRepository } from '@mikro-orm/postgresql';

import { TaskEntity } from '../entity/task.entity';
import { ITask } from 'src/tasks/types/task';
import { EntityData, Loaded } from '@mikro-orm/core';

export class TasksRepo extends EntityRepository<TaskEntity> {
  async generatePublicId(): Promise<string> {
    const [result] = await this.em.execute<{ id: string }[]>(
      'SELECT uuid_generate_v4() AS id',
    );

    return result.id;
  }

  async createTask(data: EntityData<TaskEntity>): Promise<ITask> {
    const publicId = await this.generatePublicId();
    const entity = this.create(data);
    this.assign(entity, { ...data, publicId });
    await this.em.persist(entity).flush();

    return this.fromEntityToTask(entity);
  }

  async updateTask(entity: Loaded<TaskEntity, never>) {
    await this.em.persist(entity).flush();

    return this.fromEntityToTask(entity);
  }

  async getTasksView(): Promise<any> {
    const tasks = await this.getTasksViewQuery();

    return tasks;
  }

  async getTasksViewForUser(executorPublicId: string): Promise<any> {
    const tasks = await this.getTasksViewQuery().where(
      'executor.public_id',
      executorPublicId,
    );

    return tasks;
  }

  private fromEntityToTask(entity: TaskEntity): ITask {
    const result: ITask = {
      id: entity.id,
      publicId: entity.publicId,
      title: entity.title,
      description: entity.description || null,
      cost: entity.cost,
      reward: entity.reward,
      creator: entity.creator.publicId,
      executor: entity.executor.publicId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      completedAt: entity.completedAt || null,
    };

    return result;
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
      .join('users AS creator', 'creator.id', 't.creator_id')
      .join('users AS executor', 'executor.id', 't.executor_id');
  }
}
