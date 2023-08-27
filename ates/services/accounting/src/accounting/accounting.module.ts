import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { AppConfigService } from '../config.service';
import { EventBusModule } from '../eventbus/eventbus.module';
import { UserEntity } from '../db/entity/user.entity';
import { TaskEntity } from '../db/entity/task.entity';
import { AccountLogEntity } from '../db/entity/account-log.entity';
import { TasksController } from './accounting.controller';
import { AccountingService } from './accounting.service';

@Module({
  imports: [
    EventBusModule,
    MikroOrmModule.forFeature({
      entities: [UserEntity, TaskEntity, AccountLogEntity],
    }),
  ],
  controllers: [TasksController],
  providers: [AccountingService, AppConfigService],
})
export class AccountingModule {}
