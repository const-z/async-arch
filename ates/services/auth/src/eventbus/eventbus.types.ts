export interface IEvent {
  pattern: string;
  data: unknown;
}

export interface IEventProducer {
  emitAndWait(event: IEvent): Promise<void>;
}
