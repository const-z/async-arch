import { Inject, Injectable } from '@nestjs/common';

import { AppConfigService } from '../config.service';
import { UsersRepo } from '../db/repository/users.repo';
import { TasksRepo } from '../db/repository/tasks.repo';
import { IEventProducer } from '../eventbus/eventbus.types';
import { EVENT_PRODUCER } from '../constants';
import { ICloseTaskData, INewTaskData, ITask } from './types/task';
import {
  TaskStreamEventFactory as TaskSE,
  TaskStreamEventTypes,
} from './events/task.s-events';
import {
  TaskBusinessEventFactory as TaskBE,
  TaskBusinessEventTypes,
} from './events/task.b-events';
import { UserRoles } from 'src/common/users.roles';
import { UserEntity } from 'src/db/entity/user.entity';

@Injectable()
export class TasksService {
  constructor(
    private readonly usersRepo: UsersRepo,
    private readonly tasksRepo: TasksRepo,
    @Inject(EVENT_PRODUCER)
    private readonly eventProducer: IEventProducer,
  ) {}

  async getTasks(): Promise<ITask[]> {
    const tasks = await this.tasksRepo.getTasksView();

    return tasks;
  }

  async createTask(data: INewTaskData): Promise<void> {
    const executor = await this.getRandomExecutor();

    const task = {
      ...data,
      cost: Number((Math.random() * 10 + 9).toFixed(2)),
      reward: Number((Math.random() * 20 + 19).toFixed(2)),
      executor,
    };

    const createdTask = await this.tasksRepo.createTask(task);

    console.log(createdTask);

    // const entity = this.tasksRepo.create(data);

    // this.tasksRepo.assign(entity, {
    //   cost: Number((Math.random() * 10 + 9).toFixed(2)),
    //   reward: Number((Math.random() * 20 + 19).toFixed(2)),
    //   executor,
    // });

    // await this.tasksRepo.getEntityManager().persistAndFlush(entity);

    // await this.eventProducer.emitAndWait(
    //   TaskSE.create(TaskStreamEventTypes.TASK_CREATED).toEvent(createdTask),
    // );
    // await this.eventProducer.emitAndWait(
    //   TaskBE.create(TaskBusinessEventTypes.TASK_ASSIGNED).toEvent(createdTask),
    // );
  }

  async closeTask(data: ICloseTaskData) {
    // await this.eventProducer.emitAndWait(
    //   TaskSE.create(TaskStreamEventTypes.TASK_UPDATED).toEvent(updatedTask),
    // );
    // await this.eventProducer.emitAndWait(
    //   TaskBE.create(TaskBusinessEventTypes.TASK_DONE).toEvent(updatedTask),
    // );
  }

  async shuffle() {
    // if (reassigned) {
    //   await this.eventProducer.emitAndWait(
    //     TaskSE.create(TaskStreamEventTypes.TASK_UPDATED).toEvent(updatedTask),
    //   );
    //   await this.eventProducer.emitAndWait(
    //     TaskBE.create(TaskBusinessEventTypes.TASK_ASSIGNED).toEvent(
    //       updatedTask,
    //     ),
    //   );
    // }
  }

  async getRandomExecutor(): Promise<UserEntity> {
    const users = await this.usersRepo.find({
      role: { $nin: [UserRoles.ADMIN, UserRoles.MANAGER] },
    });

    const result = users[Math.floor(Math.random() * users.length)];

    return result;
  }
}
