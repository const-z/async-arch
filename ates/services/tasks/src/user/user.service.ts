import { Inject, Injectable } from '@nestjs/common';

import { AppConfigService } from '../config.service';
import { UsersRepo } from '../db/repository/users.repo';
import { IEventProducer } from '../eventbus/eventbus.types';
import { EVENT_PRODUCER } from '../constants';
import { IUser } from './types/user';
import { UserEventTypes } from './types/events';

@Injectable()
export class UserService {
  constructor(
    private readonly config: AppConfigService,
    private readonly userRepo: UsersRepo,
    @Inject(EVENT_PRODUCER)
    private readonly eventProducer: IEventProducer,
  ) {}

  getHello(): string {
    return `Hello from ${this.config.appName}`;
  }

  async upsertUser(data: IUser): Promise<void> {
    const user = await this.userRepo.upsert(data as any);

    await this.eventProducer.emitAndWait({
      pattern: UserEventTypes.USER_CREATED,
      data: user,
    });
  }
}
