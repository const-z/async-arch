import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { JwtModule } from '@nestjs/jwt';

import { AppConfigService } from './config.service';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { TasksModule } from './tasks/tasks.module';
import { AccountingModule } from './accounting/accounting.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRoot(),
    JwtModule.register({
      global: true,
    }),
    UserModule,
    TasksModule,
    AccountingModule,
  ],
  controllers: [AppController],
  providers: [AppConfigService],
})
export class AppModule {}
