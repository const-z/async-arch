import { IEvent } from '../../eventbus/eventbus.types';
import { IUser } from '../types/user';

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
  constructor(private readonly eventName: string) {}

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
    return {
      topic: UserBusinessEventTopics.Users,
      data: {
        eventName: this.eventName,
        data: this.convertData(data),
      },
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
    super(UserPermissionsChangedEvent.name);
  }
}
