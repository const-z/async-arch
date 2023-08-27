import {
  TaskCreatedEventValidatorV1,
  TaskUpdatedEventValidatorV1,
} from 'schema-registry';

import { IEvent } from '../../eventbus/eventbus.types';
import { ITask } from '../types/task';
import { EventDataValidationException } from '../tasks.exceptions';

interface EventDataValidator {
  validate(data: unknown): boolean;
}

export interface ITaskStreamEventData {
  publicId: string;
  title: string;
  description: string;
  cost: number;
  reward: number;
  creator: string;
  executor: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date;
}

export enum TaskStreamEventTypes {
  TASK_CREATED = 'TaskCreated',
  TASK_UPDATED = 'TaskUpdated',
}

export enum TaskStreamEventTopics {
  TASKS_STREAM = 'tasks.stream',
}

abstract class CommonTaskStreamEvent {
  constructor(
    private readonly eventName: string,
    private readonly validator: EventDataValidator,
  ) {}

  private convertData(data: ITask): ITaskStreamEventData {
    const eventData: ITaskStreamEventData = {
      publicId: data.publicId,
      title: data.title,
      description: data.description,
      cost: data.cost,
      reward: data.reward,
      creator: data.creator,
      executor: data.executor,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      completedAt: data.completedAt,
    };

    return eventData;
  }

  toEvent(data: ITask): IEvent {
    const eventData = {
      eventName: this.eventName,
      data: this.convertData(data),
    };

    const isValid = this.validator.validate(eventData);

    if (!isValid) {
      throw new EventDataValidationException();
    }

    return {
      topic: TaskStreamEventTopics.TASKS_STREAM,
      data: eventData,
    };
  }
}

export class TaskStreamEventFactory {
  static create(type: TaskStreamEventTypes): CommonTaskStreamEvent {
    if (type === TaskStreamEventTypes.TASK_CREATED) {
      return new TaskCreatedEvent();
    }
    if (type === TaskStreamEventTypes.TASK_UPDATED) {
      return new TaskUpdatedEvent();
    }
  }
}

class TaskCreatedEvent extends CommonTaskStreamEvent {
  constructor() {
    super(TaskCreatedEvent.name, new TaskCreatedEventValidatorV1());
  }
}

class TaskUpdatedEvent extends CommonTaskStreamEvent {
  constructor() {
    super(TaskUpdatedEvent.name, new TaskUpdatedEventValidatorV1());
  }
}
