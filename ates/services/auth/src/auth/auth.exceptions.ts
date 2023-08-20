import { AppException } from '../common/app.exception';
import { StatusDescription } from '../common/status.description';

export class InvalidCredentialsException extends AppException {
  constructor() {
    super(
      '2001',
      InvalidCredentialsException.name,
      StatusDescription.WRONG_LOGIN_OR_PASSWORD,
    );
    this.statusCode = 403;
  }
}
