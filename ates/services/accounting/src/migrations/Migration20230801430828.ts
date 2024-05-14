import { Migration } from '@mikro-orm/migrations';

export class Migration20230801130628 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `
        CREATE TABLE account_log
        (
          id            serial          NOT NULL PRIMARY KEY,
          public_id     uuid            NOT NULL,
          user_id       int             NOT NULL CONSTRAINT user_id_fk REFERENCES users,
          task_id       int             NOT NULL CONSTRAINT task_id_fk REFERENCES tasks,
          amount        real            NOT NULL,
          type          varchar         NOT NULL,
          created_at    timestamptz(0)  NOT NULL DEFAULT now()
        );
      `,
    );
  }

  async down(): Promise<void> {
    this.addSql('DROP TABLE IF EXISTS account_log CASCADE');
  }
}
