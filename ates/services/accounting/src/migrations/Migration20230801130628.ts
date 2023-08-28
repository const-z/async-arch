import { Migration } from '@mikro-orm/migrations';

export class Migration20230801130628 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        CREATE TABLE users
        (
          id          serial          NOT NULL PRIMARY KEY,
          public_id   uuid            NOT NULL,
          role        varchar         NOT NULL,
          login       varchar         NOT NULL,
          name        varchar         NOT NULL,
          email       varchar         NOT NULL,
          
          deleted_at  timestamptz(0)  ,
          created_at  timestamptz(0)  NOT NULL DEFAULT now(),
          updated_at  timestamptz(0)  NOT NULL DEFAULT now()
        );

        CREATE UNIQUE INDEX users_public_id_uindex ON users (public_id);
        CREATE UNIQUE INDEX users_login_uindex ON users (login);


        CREATE TABLE tasks
        (
          id            serial          NOT NULL PRIMARY KEY,
          public_id     uuid            NOT NULL,


          title         varchar         NOT NULL,
          description   varchar         ,
          cost          real            NOT NULL,
          reward        real            NOT NULL,
          creator_id    int             NOT NULL CONSTRAINT creator_fk REFERENCES users,
          executor_id   int             NOT NULL CONSTRAINT executor_fk REFERENCES users,

          completed_at  timestamptz(0)  ,
          created_at    timestamptz(0)  NOT NULL DEFAULT now(),
          updated_at    timestamptz(0)  NOT NULL DEFAULT now()
        );
      `,
    );
  }

  async down(): Promise<void> {
    this.addSql('DROP TABLE IF EXISTS tasks CASCADE');
    this.addSql('DROP TABLE IF EXISTS users CASCADE');
  }
}
