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
  connect: (...args) => {
    const queryCallback = () => db.connect(...args);
    if (asyncWrapper.calledOnce) return queryCallback();
    asyncWrapper.calledOnce = true;
    return runModels(queryCallback);
  },
  query: (...args) => {
    const queryCallback = () => db.query(...args);
    if (asyncWrapper.calledOnce) return queryCallback();
    asyncWrapper.calledOnce = true;
    return runModels(queryCallback);
  },
};

export default asyncWrapper;

