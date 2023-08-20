import { IEvent } from '../../eventbus/eventbus.types';
import { ITask } from '../types/task';

export interface ITaskBusinessEventData {
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

export enum TaskBusinessEventTypes {
  TASK_ASSIGNED = 'TaskAssigned',
  TASK_COMPLETED = 'TaskCompleted',
}

export enum TaskBusinessEventTopics {
  TASKS_TOPIC = 'tasks',
}

abstract class CommonTaskBusinessEvent {
  constructor(private readonly eventName: string) {}

  private convertData(data: ITask): ITaskBusinessEventData {
    const eventData: ITaskBusinessEventData = {
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
      topic: TaskBusinessEventTopics.TASKS_TOPIC,
      data: {
        eventName: this.eventName,
        data: this.convertData(data),
      },
    };
  }
}

export class TaskBusinessEventFactory {
  static create(type: TaskBusinessEventTypes): CommonTaskBusinessEvent {
    if (type === TaskBusinessEventTypes.TASK_ASSIGNED) {
      return new TaskAssignedEvent();
    } else if (type === TaskBusinessEventTypes.TASK_COMPLETED) {
      return new TaskCompletedEvent();
    }
  }
}

export class TaskAssignedEvent extends CommonTaskBusinessEvent {
  constructor() {
    super(TaskAssignedEvent.name);
  }
}

export class TaskCompletedEvent extends CommonTaskBusinessEvent {
  constructor() {
    super(TaskCompletedEvent.name);
  }
}
