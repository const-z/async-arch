import { Logger } from '@nestjs/common';
import { LoadStrategy, Options } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';

import { AppConfigService } from './config.service';

const logger = new Logger('MikroORM');

const appConfig = new AppConfigService();

const config: Options = {
  allowGlobalContext: true,
  type: 'postgresql',
  host: appConfig.database.host,
  debug: true,
  logger: logger.log.bind(logger),
  port: appConfig.database.port,
  user: appConfig.database.username,
  password: appConfig.database.password,
  dbName: appConfig.database.name,
  entities: ['dist/db/entity/*.entity.js'],
  entitiesTs: ['src/db/entity/*.entity.ts'],
  loadStrategy: LoadStrategy.JOINED,
  // @ts-expect-error nestjs adapter option
  registerRequestContext: false,
  extensions: [Migrator, SeedManager],
  migrations: {
    transactional: true,
    emit: 'ts',
    allOrNothing: true,
    dropTables: true,
    snapshot: false,
    path: 'dist/migrations',
    pathTs: 'src/migrations',
  },
  seeder: {
    path: 'dist/seeders/',
    pathTs: undefined,
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
  },
  // highlighter: new SqlHighlighter(),
  // metadataProvider: TsMorphMetadataProvider,
};

export default config;
