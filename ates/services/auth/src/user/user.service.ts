import { Inject, Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

import { AppConfigService } from '../config.service';
import { UsersRepo } from '../db/repository/users.repo';
import { RolesRepo } from '../db/repository/roles.repo';
import { NewUserData } from './types/user';
import { IEventProducer } from '../eventbus/eventbus.types';
import { EVENT_PRODUCER } from '../constants';

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

  async createUser(data: NewUserData) {
    const role = await this.roleRepo.findOneOrFail({ name: data.role });
    const id = await this.userRepo.getId();
    const password = createHash('md5').update(data.password).digest('hex');

    const userEntity = {
      ...data,
      password,
      role,
      id,
    };

    const user = await this.userRepo.upsert(userEntity);

    await this.eventProducer.emitAndWait({
      pattern: 'user.created',
      data: user,
    });
  }

  async getUsers(): Promise<any> {
    const result = await this.userRepo.findAll({ populate: ['role'] });

    return result;
  }
}
