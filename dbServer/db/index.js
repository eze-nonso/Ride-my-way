import { Pool } from 'pg';

import config from './config.json';

import { car, user, ride, request } from '../models';

const env = process.env.NODE_ENV;

const database = {
  connectionString: process.env[config[env].use_env_variable],
};

const db = new Pool(database);

const runModels = callback =>
  car(db, () => {
    user(db, () => {
      ride(db, () => {
        request(db, callback);
      });
    });
  });

const asyncWrapper = {
  connect: (callback) => {
    const queryCallback = () => db.connect(callback);
    asyncWrapper.tablesCreated((error) => {
      if (error) return runModels(queryCallback);
      return process.nextTick(() => queryCallback());
    });
  },
  query: (queryObj, callback2, callback) => {
    const queryCallback = () => db.query(queryObj, callback2, callback);
    asyncWrapper.tablesCreated((error) => {
      if (error) return runModels(queryCallback);
      return process.nextTick(() => queryCallback());
    });
  },
  tablesCreated: (callback) => {
    db.query('select from requests', (error) => {
      if (error) return callback(error);
      return callback();
    });
  },
};

export default asyncWrapper;

