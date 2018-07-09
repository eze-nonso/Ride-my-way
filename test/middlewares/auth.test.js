/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */

import sinon from 'sinon';

import bcrypt from 'bcrypt';

import sinonChai from 'sinon-chai';

import chai from 'chai';

import auth from '../../dbServer/middlewares/auth';

chai.use(sinonChai);

const { expect } = chai;

describe('Tests for auth middleware', () => {
  describe('Tests for auth.verifyTokenMware', () => {
    it('Should throw if no token in request header', () => {
      const req = { headers: {} };
    });
  });
});
