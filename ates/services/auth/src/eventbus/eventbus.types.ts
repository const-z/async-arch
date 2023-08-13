import { UserEventTypes } from '../user/types/events';

export interface IEvent {
  pattern: UserEventTypes;
  data: unknown;
}

export interface IEventProducer {
  emitAndWait(event: IEvent): Promise<void>;
}
