import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';

import { IEventData } from '../eventbus/eventbus.types';
import { TasksService } from './tasks.service';
import {
  TaskStreamEventTypes,
  TaskBusinessEventTypes,
  TasksEventTopics,
} from './types/events';
import { ITask } from './types/task';
import { UnknownEventException } from './tasks.exceptions';

@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @EventPattern(TasksEventTopics.TasksStream)
  async handleTasksStream(
    @Payload() data: IEventData<ITask>,
    @Ctx() context: KafkaContext,
  ) {
    if (data.eventName === TaskStreamEventTypes.TASK_CREATED) {
      Logger.log(`Add new task: ${JSON.stringify(data.data)}`);
      await this.tasksService.upsertTask(data.data);
    } else if (data.eventName === TaskStreamEventTypes.TASK_UPDATED) {
      Logger.log(`Update task: ${JSON.stringify(data.data)}`);
      await this.tasksService.upsertTask(data.data);
    } else {
      throw new UnknownEventException(data.eventName);
    }

    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    await context
      .getConsumer()
      .commitOffsets([
        { topic, partition, offset: (Number(offset) + 1).toString() },
      ]);
  }

  @EventPattern(TasksEventTopics.Tasks)
  async handleTasksBusiness(
    @Payload() data: IEventData<ITask>,
    @Ctx() context: KafkaContext,
  ) {
    if (data.eventName === TaskBusinessEventTypes.TASK_ASSIGNED) {
      await this.tasksService.writeOff(data.data);
    } else if (data.eventName === TaskBusinessEventTypes.TASK_COMPLETED) {
      await this.tasksService.enroll(data.data);
    } else {
      throw new UnknownEventException(data.eventName);
    }

    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    await context
      .getConsumer()
      .commitOffsets([
        { topic, partition, offset: (Number(offset) + 1).toString() },
      ]);
  }
}
