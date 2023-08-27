import { Inject, Injectable } from '@nestjs/common';

import { TasksRepo } from '../db/repository/tasks.repo';
import { AccountLogRepo } from '../db/repository/account-log.repo';
import { IEventProducer } from '../eventbus/eventbus.types';
import { EVENT_PRODUCER } from '../constants';
import { ITask } from './types/task';
import { AccountLogEntity } from 'src/db/entity/account-log.entity';
import { UsersRepo } from 'src/db/repository/users.repo';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepo: TasksRepo,
    private readonly usersRepo: UsersRepo,
    private readonly accountLogRepo: AccountLogRepo,
    @Inject(EVENT_PRODUCER)
    private readonly eventProducer: IEventProducer,
  ) {}

  async upsertTask(data: ITask): Promise<void> {
    const entityData = await this.tasksRepo.toEntity(data);
    await this.tasksRepo.upsert(entityData);
  }

  async enroll(data: ITask): Promise<void> {
    const publicId = await this.accountLogRepo.generatePublicId();
    const task = await this.tasksRepo.findOne({ publicId: data.publicId });
    const user = await this.usersRepo.findOne({ publicId: data.executor });

    const entity: AccountLogEntity = this.accountLogRepo.create({
      amount: data.reward,
      publicId,
      task,
      user,
      type: 'enroll',
    });

    await this.accountLogRepo.upsert(entity);
  }

  async writeOff(data: ITask): Promise<void> {
    const publicId = await this.accountLogRepo.generatePublicId();
    const task = await this.tasksRepo.findOne({ publicId: data.publicId });
    const user = await this.usersRepo.findOne({ publicId: data.executor });

    const entity: AccountLogEntity = this.accountLogRepo.create({
      amount: data.reward,
      publicId,
      task,
      user,
      type: 'writeoff',
    });

    await this.accountLogRepo.upsert(entity);
  }
}
