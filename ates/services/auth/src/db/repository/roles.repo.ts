import { EntityRepository } from '@mikro-orm/postgresql';

import { RoleEntity } from '../entity/role.entity';

export class RolesRepo extends EntityRepository<RoleEntity> {}
