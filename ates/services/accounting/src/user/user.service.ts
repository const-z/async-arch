import { Inject, Injectable } from '@nestjs/common';

import { AppConfigService } from '../config.service';
import { UsersRepo } from '../db/repository/users.repo';
import { IEventProducer } from '../eventbus/eventbus.types';
import { EVENT_PRODUCER } from '../constants';
import { IUser } from './types/user';

@Injectable()
export class UserService {
  constructor(
    private readonly config: AppConfigService,
    private readonly userRepo: UsersRepo,
    @Inject(EVENT_PRODUCER)
    private readonly eventProducer: IEventProducer,
  ) {}

  async upsertUser(data: IUser): Promise<void> {
    await this.userRepo.upsert(data);
  }
}
