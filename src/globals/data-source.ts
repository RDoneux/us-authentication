import dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';
import { testDataSource } from '../__e2e_tests__/test-utils';
import { User } from '../entities/user.entity';

const _dataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number.parseInt(process.env.MYSQL_PORT || '3306'),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  // entities: ['*.entity.{js,ts}'],
  // entities: ["src/entities/*{.js,.ts}"],
  entities: [User],
  migrations: ['src/resources/migrations/*.ts'],
  logging: true,
  synchronize: false,
});

export const dataSource = process.env.NODE_ENV === 'test' ? testDataSource : _dataSource;
