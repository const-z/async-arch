import { IEvent } from '../../eventbus/eventbus.types';
import { ITask } from '../types/task';

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
  TASK_DELETED = 'TaskDeleted',
}

export enum TaskStreamEventTopics {
  TASKS_STREAM = 'tasks.stream',
}

abstract class CommonTaskStreamEvent {
  constructor(private readonly eventName: string) {}

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
    return {
      topic: TaskStreamEventTopics.TASKS_STREAM,
      data: {
        eventName: this.eventName,
        data: this.convertData(data),
      },
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
    if (type === TaskStreamEventTypes.TASK_DELETED) {
      return new TaskDeletedEvent();
    }
  }
}

class TaskCreatedEvent extends CommonTaskStreamEvent {
  constructor() {
    super(TaskCreatedEvent.name);
  }
}

class TaskUpdatedEvent extends CommonTaskStreamEvent {
  constructor() {
    super(TaskUpdatedEvent.name);
  }
}

class TaskDeletedEvent extends CommonTaskStreamEvent {
  constructor() {
    super(TaskDeletedEvent.name);
  }
}
