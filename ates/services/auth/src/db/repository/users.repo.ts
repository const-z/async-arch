import { EntityRepository } from '@mikro-orm/postgresql';

import { UserEntity } from '../entity/user.entity';

export class UsersRepo extends EntityRepository<UserEntity> {
  async getId(): Promise<string> {
    const [result] = await this.em.execute<{ id: string }[]>(
      'SELECT uuid_generate_v4() AS id',
    );

    return result.id;
  }
}
