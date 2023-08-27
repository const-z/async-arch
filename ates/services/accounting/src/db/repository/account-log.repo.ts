import { EntityRepository } from '@mikro-orm/postgresql';

import { AccountLogEntity } from '../entity/account-log.entity';

export class AccountLogRepo extends EntityRepository<AccountLogEntity> {
  async generatePublicId(): Promise<string> {
    const [result] = await this.em.execute<{ id: string }[]>(
      'SELECT uuid_generate_v4() AS id',
    );

    return result.id;
  }
}
