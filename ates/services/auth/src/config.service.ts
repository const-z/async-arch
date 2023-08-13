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
    return 'AUTH';
  }

  get passwordSalt(): string {
    return this.get<string>('AUTH_SALT');
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
        allowAutoTopicCreation: true,
        groupId: this.appName,
      },
      producer: {
        allowAutoTopicCreation: true,
      },
      client: {
        clientId: this.appName,
        brokers: brokers.split(','),
        retry: {
          initialRetryTime: 500,
          retries: 10,
        },
      },
    };

    return kafkaConfig;
  }
}
