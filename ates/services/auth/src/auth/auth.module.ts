import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { AppConfigService } from '../config.service';
import { UserEntity } from '../db/entity/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [UserEntity],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AppConfigService],
})
export class AuthModule {}
