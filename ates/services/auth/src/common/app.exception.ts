import { AppConfigService } from '../config.service';

export enum AppExceptionCode {
  UserAlreadyExistsException = '1001',
  InvalidCredentialsException = '2001',
  EventDataValidationException = '3001',
}

export class AppException extends Error {
  readonly errorCode: string;
  readonly errorName: string;
  statusCode: number;

  constructor(errorCode: string, errorName: string, message?: string) {
    super(message);
    const config = new AppConfigService();
    this.errorCode = errorCode;
    this.errorName = `${config.appName}-${errorName}`;
  }
}
