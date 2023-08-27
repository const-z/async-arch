import { Inject, Injectable } from '@nestjs/common';

import { TaskCreatedSchemaV1 } from 'schema-registry';

import { UsersRepo } from '../db/repository/users.repo';
import { TasksRepo } from '../db/repository/tasks.repo';
import { IEventProducer } from '../eventbus/eventbus.types';
import { EVENT_PRODUCER } from '../constants';
import { UserRoles } from '../common/users.roles';
import { UserEntity } from '../db/entity/user.entity';
import { ICompleteTaskData, INewTaskData, ITask } from './types/task';
import {
  TaskStreamEventFactory as TaskSE,
  TaskStreamEventTypes,
} from './events/task.s-events';
import {
  TaskBusinessEventFactory as TaskBE,
  TaskBusinessEventTypes,
} from './events/task.b-events';
import { EventDataValidationException } from './tasks.exceptions';

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

  async getMyTasks(publicId: string): Promise<ITask[]> {
    const tasks = await this.tasksRepo.getTasksViewForUser(publicId);

    return tasks;
  }

  async createTask(data: INewTaskData): Promise<void> {
    const executor = await this.getRandomExecutor();

    const task = {
      ...data,
      cost: Number((Math.random() * 10 + 10).toFixed(2)),
      reward: Number((Math.random() * 20 + 20).toFixed(2)),
      executor,
    };

    const createdTask = await this.tasksRepo.createTask(task);

    const taskCreatedEventData = TaskSE.create(
      TaskStreamEventTypes.TASK_CREATED,
    ).toEvent(createdTask);

    const vresult = new TaskCreatedSchemaV1().validate(
      taskCreatedEventData.data,
    );

    if (!vresult) {
      throw new EventDataValidationException();
    }

    await this.eventProducer.emitAndWait(taskCreatedEventData);

    await this.eventProducer.emitAndWait(
      TaskBE.create(TaskBusinessEventTypes.TASK_ASSIGNED).toEvent(createdTask),
    );
  }

  async completeTask(data: ICompleteTaskData) {
    const task = await this.tasksRepo.findOne({ id: data.taskId });

    if (task.executor.publicId !== data.userPublicId) {
      throw new Error('Only executor can complete task');
    }

    this.tasksRepo.assign(task, { completedAt: new Date() });

    const updatedTask = await this.tasksRepo.updateTask(task);

    await this.eventProducer.emitAndWait(
      TaskSE.create(TaskStreamEventTypes.TASK_UPDATED).toEvent(updatedTask),
    );
    await this.eventProducer.emitAndWait(
      TaskBE.create(TaskBusinessEventTypes.TASK_COMPLETED).toEvent(updatedTask),
    );
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
