/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */

import sinon from 'sinon';

import sinonChai from 'sinon-chai';

import proxyquire from 'proxyquire';

import chai from 'chai';

const db = { query: () => {} };

const { default: getRide } = proxyquire('../../dbServer/controllers/getRide', {
  '../db': { default: db },
});

chai.use(sinonChai);

const { expect } = chai;

describe('Get ride controller', () => {
  const req = {
    params: {},
    decoded: { payload: { id: 3 } },
  };

  const status = sinon.spy();

  const res = { status };

  const next = sinon.spy();

  const done = sinon.spy();

  afterEach('Clear histories and restore', () => {
    status.resetHistory();
    next.resetHistory();
    done.resetHistory();
    sinon.restore();
  });
  describe('Error handling', () => {
    it('Should call next with error if db.query fails with error', () => {
      req.params.rideId = 1;
      sinon.stub(db, 'query').yields('error');
      getRide(req, res, next);
      expect(next).to.have.been.calledWith('error');
      expect(status).to.not.be.called;
    });
  });
});
