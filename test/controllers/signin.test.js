/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */

import sinon from 'sinon';

import sinonChai from 'sinon-chai';

import proxyquire from 'proxyquire';

import chai from 'chai';

const compare = sinon.stub();

const db = { query: () => {} };

const { default: [, signin] } = proxyquire('../../dbServer/controllers/signin', {
  '../db': { default: db },
  '../middlewares/encrypt': { default: { compare } },
});

chai.use(sinonChai);

const { expect } = chai;

describe('Reply request controller', () => {
  const req = {
    params: {},
    decoded: { payload: { id: 3 } },
    body: { email: true },
  };

  const status = sinon.spy();

  const res = { status };

  const next = sinon.spy();

  afterEach('Clear histories and restore', () => {
    status.resetHistory();
    next.resetHistory();
    sinon.restore();
  });

  describe('Error handling', () => {
    it('Should call next with error if first db.query fails with error', () => {
      sinon.stub(db, 'query').yields('error');
      signin(req, res, next);
      expect(next).to.have.been.calledWith('error');
      expect(status).to.not.be.called;
    });
    it('Should call next with error if encrypt compare fails with error', () => {
      sinon.stub(db, 'query').yields(null, { rows: [1] });
      compare.yields('error2');
      signin(req, res, next);
      expect(next).to.have.been.calledWith('error2');
      expect(status).to.not.be.called;
    });
  });
});
