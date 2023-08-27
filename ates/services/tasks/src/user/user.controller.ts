import { Controller, Inject, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';

import { IEventData, IEventProducer } from '../eventbus/eventbus.types';
import { EVENT_PRODUCER } from '../constants';
import { UserService } from './user.service';
import { UserStreamEventTypes, UserStreamEventTopics } from './types/events';
import { IUser } from './types/user';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @EventPattern(UserStreamEventTopics.UsersStream)
  async handleUserCreated(
    @Payload() data: IEventData<IUser>,
    @Ctx() context: KafkaContext,
  ) {
    if (data.data && 'blockedAt' in data.data) {
      delete data.data.blockedAt;
    }

    if (data.eventName === UserStreamEventTypes.USER_CREATED) {
      Logger.log(`Add new user: ${JSON.stringify(data.data)}`);
      await this.userService.upsertUser(data.data);
    } else if (data.eventName === UserStreamEventTypes.USER_UPDATED) {
      Logger.log(`Update user: ${JSON.stringify(data.data)}`);
      await this.userService.upsertUser(data.data);
    } else if (data.eventName === UserStreamEventTypes.USER_DELETED) {
      Logger.log(`Delete user: ${JSON.stringify(data.data)}`);
      await this.userService.upsertUser(data.data);
    }

    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    await context
      .getConsumer()
      .commitOffsets([
        { topic, partition, offset: (Number(offset) + 1).toString() },
      ]);
  }
}
