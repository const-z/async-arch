import { AppException } from '../common/app.exception';

export class EventDataValidationException extends AppException {
  constructor() {
    super('3001', EventDataValidationException.name);
  }
}
