import { Pool } from 'pg';

import config from './config.json';

const { env: { NODE_ENV: env } } = process;

const connectionString = process.env[config[env].use_env_variable];

export const pool = new Pool({ connectionString });

export const query = (str, params, callback) => pool.query(str, params, callback);

export const connect = callback => pool.connect(callback);

