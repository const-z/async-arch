import { Migration } from '@mikro-orm/migrations';
const { AUTH_SALT } = process.env;

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
          id          uuid            NOT NULL DEFAULT uuid_generate_v4() CONSTRAINT relations_incident_pkey PRIMARY KEY,
          role_id     int             NOT NULL CONSTRAINT role_id_fk REFERENCES roles,
          login       varchar         NOT NULL,
          password    varchar         NOT NULL,
          name        varchar         NOT NULL,
          email       varchar         NOT NULL,
          is_blocked  boolean         NOT NULL DEFAULT FALSE,
          blocked_at  timestamptz(0)  ,
          deleted_at  timestamptz(0)  ,

          created_at  timestamptz(0)  NOT NULL DEFAULT now(),
          updated_at  timestamptz(0)  NOT NULL DEFAULT now()
        );

        CREATE UNIQUE INDEX users_login_uindex ON users (login);

        INSERT INTO roles(id, name) VALUES (1, 'admin'), (2, 'manager'), (3, 'popug');
        
        INSERT INTO users(login, password, name, email, role_id) 
        VALUES ('admin', MD5('admin'||'${AUTH_SALT}'), 'admin', 'admin@example.local', 1);
      `,
    );
  }
}
