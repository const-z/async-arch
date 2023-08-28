import { Injectable } from '@nestjs/common';

import { UsersRepo } from '../db/repository/users.repo';
import { TasksRepo } from '../db/repository/tasks.repo';
import { AccountLogRepo } from '../db/repository/account-log.repo';
import { AccountLog } from './types/account-log';

@Injectable()
export class AccountingService {
  constructor(
    private readonly usersRepo: UsersRepo,
    private readonly tasksRepo: TasksRepo,
    private readonly accountLogRepo: AccountLogRepo,
  ) {}

  async getLog(
    userId: number,
    date?: Date,
  ): Promise<{ log: AccountLog[]; summary: number }> {
    const data: AccountLog[] = await this.accountLogRepo.getLog(userId, date);

    const result = {
      log: data,
      summary: this.summary(data),
    };

    return result;
  }

  summary(rows: AccountLog[]): number {
    let balance = 0;

    for (const row of rows) {
      balance +=
        row.type === 'writeoff' ? -Math.abs(row.amount) : Math.abs(row.amount);
    }

    return balance;
  }
}
