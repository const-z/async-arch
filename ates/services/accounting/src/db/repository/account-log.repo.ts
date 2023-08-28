import { EntityRepository } from '@mikro-orm/postgresql';

import { AccountLogEntity } from '../entity/account-log.entity';

export class AccountLogRepo extends EntityRepository<AccountLogEntity> {
  async generatePublicId(): Promise<string> {
    const [result] = await this.em.execute<{ id: string }[]>(
      'SELECT uuid_generate_v4() AS id',
    );

    return result.id;
  }

  async getLog(userId: number, date: Date) {
    const knex = this.em.getKnex();
    const query = knex
      .from('account_log AS l')
      .select(
        'l.id',
        'l.public_id AS publicId',
        'l.type',
        'l.amount',
        'l.created_at AS createdAt',
        knex.raw(
          `
            JSON_BUILD_OBJECT(
              'publicId', t.public_id, 
              'title', t.title, 
              'description', t.description, 
              'createdAt', t.created_at,
              'completedAt', t.completed_at
            ) AS task
          `,
        ),
      )
      .join('tasks AS t', 't.id', 'l.task_id')
      .where('user_id', userId);

    if (date) {
      query.whereBetween('l.created_at', [
        knex.raw(`date_trunc('day', ?::DATE)`, date),
        knex.raw(`date_trunc('day', ?::DATE) + interval '1' day`, date),
      ]);
    }

    return query;
  }
}
