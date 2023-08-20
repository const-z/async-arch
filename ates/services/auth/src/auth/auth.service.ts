import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfigService } from '../config.service';
import { UsersRepo } from '../db/repository/users.repo';
import { getPasswordHash } from '../common/password.hash';
import { IAuthData, IToken } from './types/user';
import { InvalidCredentialsException } from './auth.exceptions';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: AppConfigService,
    private readonly userRepo: UsersRepo,
    private jwtService: JwtService,
  ) {}

  async login(data: IAuthData): Promise<IToken> {
    const { login, password } = data;

    const user = await this.userRepo.findOne(
      { login },
      { populate: ['password'] },
    );

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const passwordHash = getPasswordHash(password, this.config.passwordSalt);

    if (user.password !== passwordHash) {
      throw new InvalidCredentialsException();
    }

    const token = await this.jwtService.signAsync(
      { publicId: user.publicId, role: user.role.name },
      { secret: this.config.jwtSecret },
    );

    return { token };
  }
}
