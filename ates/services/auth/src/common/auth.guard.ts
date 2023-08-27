import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { AppConfigService } from '../config.service';
import { UsersRepo } from '../db/repository/users.repo';

export function AuthGuard(allowedRoles?: string[]) {
  @Injectable()
  class AuthGuard implements CanActivate {
    constructor(
      readonly jwtService: JwtService,
      readonly config: AppConfigService,
      readonly userRepo: UsersRepo,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractToken(request);
      if (!token) {
        throw new UnauthorizedException();
      }

      const payload: { publicId: string } = await this.jwtService.verifyAsync(
        token,
        { secret: this.config.jwtSecret },
      );

      const user = await this.userRepo.getUserViewByPublicId(payload.publicId);

      if (!user || user.deletedAt) {
        throw new ForbiddenException();
      }

      if (
        user.role !== 'system' &&
        allowedRoles &&
        !allowedRoles.includes(user.role)
      ) {
        throw new ForbiddenException();
      }

      request['user'] = user;

      return true;
    }

    extractToken(request: Request): string | undefined {
      const token =
        request.headers.authorization || (request.query.token as string);

      return token;
    }
  }

  return AuthGuard;
}
