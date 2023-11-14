import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    type: 'postgres',
    host: configService.get<string>('POSTGRES_HOST'),
    port: configService.get<number>('POSTGRES_PORT') || 5432,
    username: configService.get<string>('POSTGRES_USER'),
    password: configService.get<string>('POSTGRES_PASSWORD'),
    database: configService.get<string>('POSTGRES_DB'),
    entities: [`${__dirname}src/**/**/*.entity.{ts,js}`],
    migrations: [`${__dirname}src/migrations/*.{ts,js}`],
    autoLoadEntities: true,
    extra: {
      charset: 'utf8mb4_unicode_ci',
    },
    synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE'),
    logging: true,
  }),
};

config();

const configService = new ConfigService();

export const typeOrmConfig = new DataSource({
  type: 'postgres',
  host: configService.get<'string'>('POSTGRES_HOST'),
  port: parseInt(configService.get<'number'>('POSTGRES_PORT')) || 5432,
  username: configService.get<'string'>('POSTGRES_USER'),
  password: configService.get<'string'>('POSTGRES_PASSWORD'),
  database: configService.get<'string'>('POSTGRES_DB'),
  entities: ['src/**/**/*.entity.{ts,js}'],
  migrations: ['src/migrations/*.{ts,js}'],
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
  logging: true,
});
