import { Inject, Injectable } from '@nestjs/common';

import { AppConfigService } from '../config.service';
import { UsersRepo } from '../db/repository/users.repo';
import { RolesRepo } from '../db/repository/roles.repo';
import { IEventProducer } from '../eventbus/eventbus.types';
import { EVENT_PRODUCER } from '../constants';
import { getPasswordHash } from '../common/password.hash';
import { INewUserData, IUpdateUserData, IUser } from './types/user';
import {
  UserStreamEventFactory as UserSE,
  UserStreamEventTypes,
} from './events/user.s-events';
import {
  UserBusinessEventFactory as UserBE,
  UserBusinessEventTypes,
} from './events/user.b-events';
import { UserAlreadyExistsException as UserAlreadyExistsException } from './user.exceptions';

@Injectable()
export class UserService {
  constructor(
    private readonly config: AppConfigService,
    private readonly userRepo: UsersRepo,
    private readonly roleRepo: RolesRepo,
    @Inject(EVENT_PRODUCER)
    private readonly eventProducer: IEventProducer,
  ) {}

  getHello(): string {
    return `Hello from ${this.config.appName}`;
  }

  async createUser(data: INewUserData): Promise<void> {
    await this.failIfExists(data.login);
    const password = getPasswordHash(data.password, this.config.passwordSalt);
    const newUser = await this.userRepo.createUser({ ...data, password });

    const event = UserSE.create(UserStreamEventTypes.USER_CREATED).toEvent(
      newUser,
    );
    await this.eventProducer.emitAndWait(event);
  }

  async updateUser(data: IUpdateUserData): Promise<void> {
    const user = await this.userRepo.getUserViewById(data.id);

    if (data.password) {
      data.password = getPasswordHash(data.password, this.config.passwordSalt);
    }

    const updatedUser = await this.userRepo.updateUser(data);

    await this.eventProducer.emitAndWait(
      UserSE.create(UserStreamEventTypes.USER_UPDATED).toEvent(updatedUser),
    );

    if (data.role && data.role !== user.role) {
      await this.eventProducer.emitAndWait(
        UserBE.create(UserBusinessEventTypes.USER_PERMISSIONS_CHANGED).toEvent(
          updatedUser,
        ),
      );
    }
  }

  async deleteUser(userId: number) {
    const deletedUser = await this.userRepo.deleteUser({
      id: userId,
      deletedAt: new Date(),
    });

    await this.eventProducer.emitAndWait(
      UserSE.create(UserStreamEventTypes.USER_DELETED).toEvent(deletedUser),
    );
  }

  async getUsers(): Promise<IUser[]> {
    const result = await this.userRepo.getUsersView();

    return result;
  }

  async failIfExists(login: string) {
    const user = await this.userRepo.findOne({ login });

    if (user) {
      throw new UserAlreadyExistsException();
    }
  }
}
