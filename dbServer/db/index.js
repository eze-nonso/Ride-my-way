import { Pool } from 'pg';

import config from './config.json';

const env = process.env.NODE_ENV;

const connectionString = config[env].use_env_variable;

const database = {
  connectionString,
};

export default new Pool(database);

