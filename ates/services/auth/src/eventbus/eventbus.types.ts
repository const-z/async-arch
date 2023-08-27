export interface IEventData<T = any> {
  eventName: string;
  data: T;
}

export interface IEvent {
  topic: string;
  data: IEventData;
}

export interface IEventProducer {
  emitAndWait(event: IEvent): Promise<void>;
}
