import { ConfigService } from '@nestjs/config';
import { KafkaOptions } from '@nestjs/microservices';

export interface IDatabaseCredentials {
  name: string;
  username: string;
  password: string;
  host: string;
  port: number;
}

export class AppConfigService extends ConfigService {
  get appName(): string {
    return 'TASKS';
  }

  get jwtSecret(): string {
    return this.get<string>('JWT_SECRET');
  }

  get database(): IDatabaseCredentials {
    const dbConfig = {
      name: this.get<string>(`${this.appName}_DB`),
      username: this.get<string>(`${this.appName}_DB_USER`),
      password: this.get<string>(`${this.appName}_DB_PASSWORD`),
      host: `${this.appName.toLowerCase()}_db`,
      port: 5432,
    };

    return dbConfig;
  }

  get kafka(): KafkaOptions['options'] {
    const brokers = this.get<string>('KAFKA_BROKERS', 'kafka:9092');

    const kafkaConfig: KafkaOptions['options'] = {
      consumer: {
        allowAutoTopicCreation: false,
        groupId: this.appName,
      },
      producer: {
        allowAutoTopicCreation: false,
      },
      client: {
        clientId: this.appName,
        brokers: brokers.split(','),
        retry: {
          initialRetryTime: 500,
          retries: 10,
        },
      },
      run: {
        autoCommit: false,
      },
    };

    return kafkaConfig;
  }
}
