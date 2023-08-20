import { EntityRepository } from '@mikro-orm/postgresql';
import { EntityData } from '@mikro-orm/core';

import { UserEntity } from '../entity/user.entity';

export class UsersRepo extends EntityRepository<UserEntity> {
  async upsert(data: EntityData<UserEntity>): Promise<UserEntity> {
    const entity =
      (await this.findOne({ publicId: data.publicId })) || new UserEntity();

    this.assign(entity, data);

    await this.getEntityManager().persist(entity).flush();

    return entity;
  }
}
