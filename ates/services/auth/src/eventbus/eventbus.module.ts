import { Module } from '@nestjs/common';
import { ClientKafka, ServerKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { AppConfigService } from '../config.service';
import { IEvent, IEventProducer } from './eventbus.types';
import { EVENT_PRODUCER } from '../constants';

export class EventBusTransport extends ServerKafka {}

export class EventProducer extends ClientKafka implements IEventProducer {
  async emitAndWait(event: IEvent): Promise<void> {
    const { pattern, data } = event;
    await firstValueFrom(super.emit(pattern, data));
  }
}

const EventBusFactory = {
  provide: EVENT_PRODUCER,
  useFactory: async (config: AppConfigService) => {
    return new EventProducer(config.kafka);
  },
  inject: [AppConfigService],
};

@Module({
  exports: [EventBusFactory],
  providers: [AppConfigService, EventBusFactory],
  imports: [],
})
export class EventBusModule {}
