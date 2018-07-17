/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */

import sinon from 'sinon';

import sinonChai from 'sinon-chai';

import proxyquire from 'proxyquire';

import chai from 'chai';

const db = { connect: () => {} };

const { default: [,, signup] } = proxyquire('../../dbServer/controllers/signup', {
  '../db': { default: db },
});

chai.use(sinonChai);

const { expect } = chai;

describe('Signup controller', () => {
  const req = {
    body: { email: true, firstname: true, lastname: true },
  };

  const status = sinon.spy();

  const res = { status };

  const next = sinon.spy();

  const query = sinon.stub();

  const client = { query };

  const done = sinon.spy();

  afterEach('Clear histories and restore', () => {
    status.resetHistory();
    next.resetHistory();
    done.resetHistory();
    query.reset();
    sinon.restore();
  });

  describe('Error handling', () => {
    it('Should call next with error if db.connect fails with error', () => {
      sinon.stub(db, 'connect').yields('error');
      signup(req, res, next);
      expect(next).to.have.been.calledWith('error');
      expect(status).to.not.be.called;
    });
    it('Should call next with error and done if first client.query fails with error', () => {
      sinon.stub(db, 'connect').yields(null, client, done);
      query.yields('error1');
      signup(req, res, next);
      expect(next).to.have.been.calledWith('error1');
      expect(done).to.have.been.calledOnce;
      expect(status).to.not.be.called;
    });
    it('Should call next with error and done if second client.query fails with error', () => {
      sinon.stub(db, 'connect').yields(null, client, done);
      query.yields(null, { rows: [] })
        .onSecondCall().yields('error2');
      signup(req, res, next);
      expect(next).to.have.been.calledWith('error2');
      expect(done).to.have.been.calledOnce;
      expect(status).to.not.be.called;
    });
    it('Should call next with error and done if third client.query fails with error', () => {
      sinon.stub(db, 'connect').yields(null, client, done);
      query.yields(null, { rows: [] })
        .onSecondCall().yields(null, { rows: [{ id: 1 }] })
        .onThirdCall()
        .yields('error3');
      signup(req, res, next);
      expect(next).to.have.been.calledWith('error3');
      expect(done).to.have.been.calledOnce;
      expect(status).to.not.be.called;
    });
  });
});
