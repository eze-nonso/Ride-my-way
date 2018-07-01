import { Pool } from 'pg';

const config = {
  user: 'postgres',
  database: 'ride-my-way_dev',
  password: 'dinma1995',
  max: 10,
};

export default new Pool(config);

