import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { AppConfigService } from '../config.service';
import { EventBusModule } from '../eventbus/eventbus.module';
import { UserEntity } from '../db/entity/user.entity';
import { RoleEntity } from '../db/entity/role.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    EventBusModule,
    MikroOrmModule.forFeature({
      entities: [UserEntity, RoleEntity],
    }),
  ],
  controllers: [UserController],
  providers: [UserService, AppConfigService],
})
export class UserModule {}
