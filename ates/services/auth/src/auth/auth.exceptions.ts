import { AppException, AppExceptionCode } from '../common/app.exception';
import { StatusDescription } from '../common/status.description';

export class InvalidCredentialsException extends AppException {
  constructor() {
    super(
      AppExceptionCode.InvalidCredentialsException,
      InvalidCredentialsException.name,
      StatusDescription.WRONG_LOGIN_OR_PASSWORD,
    );
    this.statusCode = 403;
  }
}
