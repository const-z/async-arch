import { UserPermissionsChangedEventValidatorV1 } from 'schema-registry';
import { IEvent } from '../../eventbus/eventbus.types';
import { IUser } from '../types/user';
import { EventDataValidationException } from '../user.exceptions';

interface EventDataValidator {
  validate(data: unknown): boolean;
}

export interface IUserBusinessEventData {
  publicId: string;

  login: string;
  name: string;
  email: string;
  role: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export enum UserBusinessEventTypes {
  USER_PERMISSIONS_CHANGED = 'UserPermissionsChanged',
}

export enum UserBusinessEventTopics {
  Users = 'users',
}

abstract class CommonUserBusinessEvent {
  constructor(
    private readonly eventName: string,
    private readonly validator: EventDataValidator,
  ) {}

  private convertData(data: IUser): IUserBusinessEventData {
    const eventData: IUserBusinessEventData = {
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
      topic: UserBusinessEventTopics.Users,
      data: eventData,
    };
  }
}

export class UserBusinessEventFactory {
  static create(type: UserBusinessEventTypes): CommonUserBusinessEvent {
    if (type === UserBusinessEventTypes.USER_PERMISSIONS_CHANGED) {
      return new UserPermissionsChangedEvent();
    }
  }
}

export class UserPermissionsChangedEvent extends CommonUserBusinessEvent {
  constructor() {
    super(
      UserPermissionsChangedEvent.name,
      new UserPermissionsChangedEventValidatorV1(),
    );
  }
}
