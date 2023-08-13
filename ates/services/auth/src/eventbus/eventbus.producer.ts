import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { IEvent, IEventProducer } from './eventbus.types';

export class EventProducer extends ClientKafka implements IEventProducer {
  async emitAndWait(event: IEvent): Promise<void> {
    const { pattern, data } = event;
    const message = typeof data === 'object' ? JSON.stringify(data) : data;

    await firstValueFrom(super.emit(pattern, message));
  }
}
