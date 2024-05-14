import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';

import {
  UserCreatedEventValidatorV1,
  UserUpdatedEventValidatorV1,
  UserDeletedEventValidatorV1,
} from 'schema-registry';

import {
  InvalidEventException,
  UnknownEventException,
} from '../common/event.exception';
import { IEventData } from '../eventbus/eventbus.types';
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
    if (data.eventName === UserStreamEventTypes.USER_CREATED) {
      Logger.log(`Add new user: ${JSON.stringify(data.data)}`);
      this.validate(data, new UserCreatedEventValidatorV1());
      await this.userService.upsertUser(data.data);
    } else if (data.eventName === UserStreamEventTypes.USER_UPDATED) {
      Logger.log(`Update user: ${JSON.stringify(data.data)}`);
      this.validate(data, new UserUpdatedEventValidatorV1());
      await this.userService.upsertUser(data.data);
    } else if (data.eventName === UserStreamEventTypes.USER_DELETED) {
      Logger.log(`Delete user: ${JSON.stringify(data.data)}`);
      this.validate(data, new UserDeletedEventValidatorV1());
      await this.userService.upsertUser(data.data);
    } else {
      throw new UnknownEventException(data.eventName);
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

  private validate(
    data,
    validator: { validate: (data) => boolean; errors: (data) => any[] },
  ) {
    if (!validator.validate(data)) {
      const errors = validator.errors(data);

      throw new InvalidEventException(JSON.stringify(errors));
    }
  }
}
