import { Inject, Injectable } from '@nestjs/common';

import { AppConfigService } from '../config.service';
import { UsersRepo } from '../db/repository/users.repo';
import { RolesRepo } from '../db/repository/roles.repo';
import { IEventProducer } from '../eventbus/eventbus.types';
import { EVENT_PRODUCER } from '../constants';
import { getPasswordHash } from '../common/password.hash';
import { INewUserData, IUpdateUserData, IUser } from './types/user';
import { UserEventTypes } from './types/events';

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
    const role = await this.roleRepo.findOneOrFail({ name: data.role });
    const id = await this.userRepo.getId();
    const password = getPasswordHash(data.password, this.config.passwordSalt);

    const userEntity = {
      ...data,
      password,
      role,
      id,
    };

    await this.userRepo.create(userEntity);

    const user = await this.userRepo.findOne({ id }, { populate: ['role'] });

    await this.eventProducer.emitAndWait({
      pattern: UserEventTypes.USER_CREATED,
      data: user,
    });
  }

  async updateUser(data: IUpdateUserData): Promise<void> {
    const { role, password, ...userAttrs } = data;

    const existsUser = await this.userRepo.findOneOrFail(
      { id: data.id },
      { populate: ['role'] },
    );

    const user = {
      ...existsUser,
      ...userAttrs,
    };

    if (role && role !== existsUser.role.name) {
      user.role = await this.roleRepo.findOneOrFail({
        name: role,
      });
    }

    if (password) {
      user.password = getPasswordHash(data.password, this.config.passwordSalt);
    }

    await this.userRepo.merge(user);

    await Promise.all([
      this.eventProducer.emitAndWait({
        pattern: UserEventTypes.USER_UPDATED,
        data: user,
      }),
      role && role !== existsUser.role.name
        ? this.eventProducer.emitAndWait({
            pattern: UserEventTypes.USER_PERMISSIONS_CHANGED,
            data: user,
          })
        : null,
    ]);
  }

  async deleteUser(userId: string) {
    const user = await this.userRepo.findOneOrFail(
      { id: userId },
      { populate: ['role'] },
    );

    user.deletedAt = new Date();

    await this.userRepo.merge(user);

    await Promise.all([
      this.eventProducer.emitAndWait({
        pattern: UserEventTypes.USER_DELETED,
        data: user,
      }),

      this.eventProducer.emitAndWait({
        pattern: UserEventTypes.USER_PERMISSIONS_CHANGED,
        data: user,
      }),
    ]);
  }

  async unblockUser(userId: string): Promise<void> {
    const user = await this.userRepo.findOneOrFail(
      { id: userId },
      { populate: ['role'] },
    );

    user.blockedAt = null;

    await this.userRepo.merge(user);

    await this.eventProducer.emitAndWait({
      pattern: UserEventTypes.USER_PERMISSIONS_CHANGED,
      data: user,
    });
  }

  async blockUser(userId: string): Promise<void> {
    const user = await this.userRepo.findOneOrFail(
      { id: userId },
      { populate: ['role'] },
    );

    user.blockedAt = new Date();

    await this.userRepo.merge(user);

    await this.eventProducer.emitAndWait({
      pattern: UserEventTypes.USER_PERMISSIONS_CHANGED,
      data: user,
    });
  }

  async getUsers(): Promise<IUser[]> {
    const result = await this.userRepo.findAll({ populate: ['role'] });

    return result;
  }
}
