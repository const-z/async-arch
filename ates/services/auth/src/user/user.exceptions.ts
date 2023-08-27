import { AppException } from '../common/app.exception';

export class UserAlreadyExistsException extends AppException {
  constructor() {
    super('1001', UserAlreadyExistsException.name);
  }
}
