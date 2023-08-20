import {
  CanActivate,
  ExecutionContext,
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
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.config.jwtSecret,
        });

        const user = await this.userRepo.findOne(
          { id: payload.id },
          { populate: ['role'] },
        );

        if (!user || user.blockedAt || user.deletedAt) {
          throw new UnauthorizedException();
        }

        if (allowedRoles && !allowedRoles.includes(user.role.name)) {
          throw new UnauthorizedException();
        }

        request['user'] = user;
      } catch {
        throw new UnauthorizedException();
      }
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
