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
    type: configService.get<'postgres'>('DATABASE_TYPE'),
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT') || 5432,
    username: configService.get<string>('DATABASE_USERNAME'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    database: configService.get<string>('DATABASE_NAME'),
    entities: [`${__dirname}src/**/**/*.entity.{ts,js}`],
    migrations: [`${__dirname}src/migrations/*.{ts,js}`],
    autoLoadEntities: true,
    extra: {
      charset: 'utf8mb4_unicode_ci',
    },
    synchronize: false,
    logging: true,
  }),
};

config();

const configService = new ConfigService();

export const typeOrmConfig = new DataSource({
  type: configService.get<'postgres'>('DATABASE_TYPE'),
  host: configService.get<'string'>('DATABASE_HOST'),
  port: parseInt(configService.get<'number'>('DATABASE_PORT')) || 5432,
  username: configService.get<'string'>('DATABASE_USERNAME'),
  password: configService.get<'string'>('DATABASE_PASSWORD'),
  database: configService.get<'string'>('DATABASE_NAME'),
  entities: ['src/**/**/*.entity.{ts,js}'],
  migrations: ['src/migrations/*.{ts,js}'],
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
  logging: true,
});
