import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { config } from 'dotenv';
import { join } from 'path';
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
    entities: [join(__dirname, '**', '**', '*.entity.{ts,js}')],
    migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
    autoLoadEntities: true,
    extra: {
      charset: 'utf8mb4_unicode_ci',
    },
    synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE') ?? false,
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
  entities: [join(__dirname, '**', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
  logging: true,
});
