import { EntityRepository } from '@mikro-orm/postgresql';

import {
  IDeleteUserData,
  INewUserData,
  IUpdateUserData,
  IUser,
} from '../../user/types/user';
import { UserEntity } from '../entity/user.entity';
import { RoleEntity } from '../entity/role.entity';

export class UsersRepo extends EntityRepository<UserEntity> {
  async generatePublicId(): Promise<string> {
    const [result] = await this.em.execute<{ id: string }[]>(
      'SELECT uuid_generate_v4() AS id',
    );

    return result.id;
  }

  async getUsersView() {
    const result = await this.getUsersViewQuery();

    return result;
  }

  async getUserViewById(userId: IUser['id']): Promise<IUser> {
    const result = await this.getUsersViewQuery().first().where('u.id', userId);

    return result;
  }

  async getUserViewByPublicId(publicId: IUser['publicId']): Promise<IUser> {
    const result = await this.getUsersViewQuery()
      .first()
      .where('u.public_id', publicId);

    return result;
  }

  async updateUser(data: IUpdateUserData) {
    const { id, role, ...userAttrs } = data;

    const entity = await this.findOneOrFail({ id }, { populate: ['role'] });

    this.assign(entity, {
      ...userAttrs,
    });

    if (role && role !== entity.role.name) {
      const roleEntity = await this.getRoleByName(role);
      this.assign(entity, { role: roleEntity });
    }

    await this.em.persist(entity).flush();

    return this.entityToUser(entity);
  }

  async deleteUser(data: IDeleteUserData) {
    const entity = await this.findOneOrFail(
      { id: data.id },
      { populate: ['role'] },
    );

    await this.em.persist(this.assign(entity, data)).flush();

    return this.entityToUser(entity);
  }

  async createUser(userData: INewUserData): Promise<IUser> {
    const entity = new UserEntity();
    entity.login = userData.login;
    entity.name = userData.name;
    entity.password = userData.password;
    entity.email = userData.email;
    entity.publicId = await this.generatePublicId();
    entity.role = await this.getRoleByName(userData.role);
    const user = this.create(entity);
    await this.em.persist(user).flush();

    return this.entityToUser(user);
  }

  async getRoleByName(name: string) {
    const rolesRepo = this.getEntityManager().getRepository(RoleEntity);
    const result = await rolesRepo.findOneOrFail({ name });

    return result;
  }

  private getUsersViewQuery() {
    return this.em
      .getKnex()
      .from('users AS u')
      .select<IUser[]>(
        'u.id',
        'u.public_id AS publicId',
        'u.login',
        'u.name',
        'u.email',
        'r.name as role',
        'u.created_at AS createdAt',
        'u.updated_at AS updatedAt',
        'u.deleted_at AS deletedAt',
      )
      .join('roles AS r', 'r.id', 'u.role_id');
  }

  private entityToUser(user: UserEntity): IUser {
    const result: IUser = {
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
      email: user.email,
      publicId: user.publicId,
      id: user.id,
      login: user.login,
      name: user.name,
      role: user.role.name,
      updatedAt: user.updatedAt,
    };

    return result;
  }
}
