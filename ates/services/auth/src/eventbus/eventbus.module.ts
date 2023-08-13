import { ServerKafka } from '@nestjs/microservices';
import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';

import { AppConfigService } from '../config.service';
import { EVENT_PRODUCER } from '../constants';
import { UserEventTypes } from '../user/types/events';
import { EventProducer } from './eventbus.producer';

export class EventBusTransport extends ServerKafka {}

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
export class EventBusModule implements OnModuleInit {
  @Inject() private readonly config!: AppConfigService;

  async onModuleInit() {
    const kafka = new Kafka({ brokers: this.config.kafka.client.brokers });
    const admin = kafka.admin({ retry: { retries: 10 } });
    await admin.connect();
    const existsTopics = await admin.listTopics();

    const topics = [...Object.values(UserEventTypes)]
      .filter((topic) => !existsTopics.includes(topic))
      .map((topic) => ({
        topic,
      }));

    if (topics.length === 0) {
      return;
    }

    await admin.createTopics({ topics });

    console.log('Topics ensured:', topics);

    await admin.disconnect();
  }
}
