import { AppException } from '../common/app.exception';

export class EventDataValidationException extends AppException {
  constructor() {
    super('3001', EventDataValidationException.name);
  }
}

export class UnknownEventException extends AppException {
  constructor(message: string) {
    super('3002', EventDataValidationException.name, message);
  }
}
