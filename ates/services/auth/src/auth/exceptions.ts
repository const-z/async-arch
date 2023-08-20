import { StatusDescription } from '../status.description';

export class InvalidCredentialsException extends Error {
  message: string = StatusDescription.WRONG_LOGIN_OR_PASSWORD;

  constructor() {
    super();
  }
}
