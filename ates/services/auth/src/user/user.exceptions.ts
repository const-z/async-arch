import { AppException, AppExceptionCode } from '../common/app.exception';

export class UserAlreadyExistsException extends AppException {
  constructor() {
    super(
      AppExceptionCode.UserAlreadyExistsException,
      UserAlreadyExistsException.name,
    );
  }
}

export class EventDataValidationException extends AppException {
  constructor() {
    super(
      AppExceptionCode.EventDataValidationException,
      EventDataValidationException.name,
    );
  }
}
