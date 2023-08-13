import { Controller, Inject } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';

import { IEventProducer } from '../eventbus/eventbus.types';
import { EVENT_PRODUCER } from '../constants';
import { UserService } from './user.service';
import { UserEventTypes } from './types/events';
import { IUser } from './types/user';

@Controller()
export class UserController {
  constructor(
    @Inject(EVENT_PRODUCER)
    private readonly eventProducer: IEventProducer,
    private readonly userService: UserService,
  ) {}

  @EventPattern(UserEventTypes.USER_CREATED)
  async handleUserCreated(
    @Payload() data: IUser,
    @Ctx() context: KafkaContext,
  ) {
    await this.userService.upsertUser(data);

    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    await this.eventProducer.commitOffsets([{ topic, partition, offset }]);
  }

  @EventPattern(UserEventTypes.USER_UPDATED)
  async handleUserUpdated(
    @Payload() data: IUser,
    @Ctx() context: KafkaContext,
  ) {
    await this.userService.upsertUser(data);

    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    await this.eventProducer.commitOffsets([{ topic, partition, offset }]);
  }

  @EventPattern(UserEventTypes.USER_DELETED)
  async handleUserDeleted(
    @Payload() data: IUser,
    @Ctx() context: KafkaContext,
  ) {
    await this.userService.upsertUser(data);

    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    await this.eventProducer.commitOffsets([{ topic, partition, offset }]);
  }
}
