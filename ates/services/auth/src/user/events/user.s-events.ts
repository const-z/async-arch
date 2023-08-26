import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import * as UserCreatedV1 from 'schema-registry/schemas/UserCreated.v1.json';
import * as UserDeletedV1 from 'schema-registry/schemas/UserDeleted.v1.json';
import * as UserUpdatedV1 from 'schema-registry/schemas/UserUpdated.v1.json';

import { IEvent } from '../../eventbus/eventbus.types';
import { IUser } from '../types/user';

const ajv = addFormats(new Ajv({}), [
  'date-time',
  'time',
  'date',
  'email',
  'hostname',
  'ipv4',
  'ipv6',
  'uri',
  'uri-reference',
  'uuid',
  'uri-template',
  'json-pointer',
  'relative-json-pointer',
  'regex',
]);

const validatorUserCreatedV1 = ajv.compile(UserCreatedV1);

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
    private readonly validateFn: any, // (data: unknown) => boolean,
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

    const v = ajv.compile(this.validateFn);

    const r = v(data);
    console.log(r);

    return {
      topic: UserStreamEventTopics.UsersStream,
      data: eventData,
    };
  }

  private validate(data) {
    const valid = this.validateFn(data);

    if (!valid) {
      throw new Error();
    }
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
    super(UserCreatedEvent.name, UserCreatedV1);
  }
}

class UserUpdatedEvent extends CommonUserStreamEvent {
  constructor() {
    super(UserUpdatedEvent.name, ajv.compile(UserUpdatedV1));
  }
}

class UserDeletedEvent extends CommonUserStreamEvent {
  constructor() {
    super(UserDeletedEvent.name, ajv.compile(UserDeletedV1));
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
