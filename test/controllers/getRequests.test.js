/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */

import sinon from 'sinon';

import sinonChai from 'sinon-chai';

import proxyquire from 'proxyquire';

import chai from 'chai';

const db = { connect: () => {} };

const { default: getRequests } = proxyquire('../../dbServer/controllers/getRequests', {
  '../db': { default: db },
});

chai.use(sinonChai);

const { expect } = chai;

describe('Get requests controller', () => {
  const req = {
    params: {},
    decoded: { payload: { id: 3 } },
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

  it('Should call next route if req.param.rideId is of non-number type', () => {
    req.params.rideId = 'string';
    getRequests(req, res, next);
    expect(next).to.be.calledOnceWith('route');
    expect(status).to.not.be.called;
  });

  describe('Error handling', () => {
    it('Should call next with error if db.connect fails with error', () => {
      req.params.rideId = 2;
      sinon.stub(db, 'connect').yields('error');
      getRequests(req, res, next);
      expect(next).to.have.been.calledWith('error');
      expect(status).to.not.be.called;
    });
    it('Should call next with error and done if first client.query fails with error', () => {
      req.params.rideId = 2;
      sinon.stub(db, 'connect').yields(null, client, done);
      query.yields('error1');
      getRequests(req, res, next);
      expect(next).to.have.been.calledWith('error1');
      expect(done).to.have.been.calledOnce;
      expect(status).to.not.be.called;
    });
    it('Should call next with error and done if second client.query fails with error', () => {
      req.params.rideId = 2;
      sinon.stub(db, 'connect').yields(null, client, done);
      query.yields(null, { rows: { length: 1 } })
        .onSecondCall().yields('error2');
      getRequests(req, res, next);
      expect(next).to.have.been.calledWith('error2');
      expect(done).to.have.been.calledOnce;
      expect(status).to.not.be.called;
    });
  });
});
