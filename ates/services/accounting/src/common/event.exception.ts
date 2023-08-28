import { AppException } from './app.exception';

export class EventDataValidationException extends AppException {
  constructor() {
    super('3001', EventDataValidationException.name);
  }
}

export class UnknownEventException extends AppException {
  constructor(message: string) {
    super('3002', UnknownEventException.name, message);
  }
}

export class InvalidEventException extends AppException {
  constructor(message: string) {
    super('3003', InvalidEventException.name, message);
  }
}
