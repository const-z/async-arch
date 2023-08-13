import { Migration } from '@mikro-orm/migrations';

export class Migration20230801130628 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        CREATE TABLE roles
        (
          id          serial          NOT NULL PRIMARY KEY,
          name        varchar(255)    NOT NULL,

          created_at  timestamptz(0)  NOT NULL DEFAULT now(),
          updated_at  timestamptz(0)  NOT NULL DEFAULT now()
        );

        CREATE UNIQUE INDEX roles_name_uindex
            ON roles (name);

        CREATE TABLE users
        (
          id          uuid            DEFAULT uuid_generate_v4() NOT NULL CONSTRAINT relations_incident_pkey PRIMARY KEY,
          role_id     int             NOT NULL CONSTRAINT role_id_fk REFERENCES roles,
          login       varchar         NOT NULL,
          password    varchar         NOT NULL,
          name        varchar         NOT NULL,
          email       varchar         NOT NULL,

          created_at  timestamptz(0)  NOT NULL DEFAULT now(),
          updated_at  timestamptz(0)  NOT NULL DEFAULT now()
        );

        CREATE UNIQUE INDEX users_login_uindex ON users (login);

        INSERT INTO roles(id, name) VALUES (1, 'admin'), (2, 'manager'), (3, 'popug');
        
        INSERT INTO users(login, password, name, email, role_id) 
        VALUES ('admin', 'b2e4553a1ad724b2ba76986ed1992c9b', 'admin', 'admin@example.local', 1);
      `,
    );
  }
}
