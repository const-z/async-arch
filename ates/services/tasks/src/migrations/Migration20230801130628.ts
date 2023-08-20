import { Migration } from '@mikro-orm/migrations';

export class Migration20230801130628 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        CREATE TABLE users
        (
          id          uuid            NOT NULL PRIMARY KEY,
          role        json            NOT NULL,
          login       varchar         NOT NULL,
          name        varchar         NOT NULL,
          email       varchar         NOT NULL,
          is_blocked  boolean         NOT NULL DEFAULT FALSE,
          blocked_at  timestamptz(0)  ,
          deleted_at  timestamptz(0)  ,

          created_at  timestamptz(0)  NOT NULL DEFAULT now(),
          updated_at  timestamptz(0)  NOT NULL DEFAULT now()
        );

        CREATE UNIQUE INDEX users_login_uindex ON users (login);
      `,
    );
  }
}
