import { EntityRepository } from '@mikro-orm/postgresql';

import { UserEntity } from '../entity/user.entity';

export class UsersRepo extends EntityRepository<UserEntity> {}
