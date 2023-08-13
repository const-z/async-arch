import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { AppConfigService } from './config.service';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { RolesRepo } from './db/repository/roles.repo';
import { UsersRepo } from './db/repository/users.repo';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRoot(),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppConfigService, RolesRepo, UsersRepo],
})
export class AppModule {}
