import {
  UserCreatedEventValidatorV1,
  UserDeletedEventValidatorV1,
  UserUpdatedEventValidatorV1,
} from 'schema-registry';

import { IEvent } from '../../eventbus/eventbus.types';
import { IUser } from '../types/user';
import { EventDataValidationException } from '../user.exceptions';

interface EventDataValidator {
  validate(data: unknown): boolean;
}

export interface IUserStreamEventData {
  publicId: string;

  login: string;
  name: string;
  email: string;
  role: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export enum UserStreamEventTypes {
  USER_CREATED = 'UserCreated',
  USER_UPDATED = 'UserUpdated',
  USER_DELETED = 'UserDeleted',
}

export enum UserStreamEventTopics {
  UsersStream = 'users.stream',
}

abstract class CommonUserStreamEvent {
  constructor(
    private readonly eventName: string,
    private readonly validator: EventDataValidator,
  ) {}

  private convertData(data: IUser): IUserStreamEventData {
    const eventData: IUserStreamEventData = {
      publicId: data.publicId,
      login: data.login,
      name: data.name,
      email: data.email,
      role: data.role,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    };

    return eventData;
  }

  toEvent(data: IUser): IEvent {
    const eventData = {
      eventName: this.eventName,
      data: this.convertData(data),
    };

    const isValid = this.validator.validate(eventData);

    if (!isValid) {
      throw new EventDataValidationException();
    }

    return {
      topic: UserStreamEventTopics.UsersStream,
      data: eventData,
    };
  }
}

export class UserStreamEventFactory {
  static create(type: UserStreamEventTypes): CommonUserStreamEvent {
    if (type === UserStreamEventTypes.USER_CREATED) {
      return new UserCreatedEvent();
    }
    if (type === UserStreamEventTypes.USER_UPDATED) {
      return new UserUpdatedEvent();
    }
    if (type === UserStreamEventTypes.USER_DELETED) {
      return new UserDeletedEvent();
    }
  }
}

class UserCreatedEvent extends CommonUserStreamEvent {
  constructor() {
    super(UserCreatedEvent.name, new UserCreatedEventValidatorV1());
  }
}

class UserUpdatedEvent extends CommonUserStreamEvent {
  constructor() {
    super(UserUpdatedEvent.name, new UserUpdatedEventValidatorV1());
  }
}

class UserDeletedEvent extends CommonUserStreamEvent {
  constructor() {
    super(UserDeletedEvent.name, new UserDeletedEventValidatorV1());
  }

  toEvent(data: IUser): IEvent {
    const result = super.toEvent(data);

    result.data.data = {
      publicId: data.publicId,
      deletedAt: data.deletedAt,
    };

    return result;
  }
}
