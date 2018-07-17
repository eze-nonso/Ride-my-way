/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */

import sinon from 'sinon';

import sinonChai from 'sinon-chai';

import chai from 'chai';

import proxyquire from 'proxyquire';

const db = { connect: () => {} };

const { default: [, createRide] } = proxyquire('../../dbServer/controllers/createRide', {
  '../db': { default: db },
});

chai.use(sinonChai);

const { expect } = chai;

describe('CreateRide controller', () => {
  const req = {
    body: {},
    decoded: { payload: {} },
  };

  const status = sinon.spy();

  const res = { status };

  const next = sinon.spy();

  const query = sinon.stub();

  const client = { query };

  const done = sinon.spy();

  afterEach('Clear histories and restore', () => {
    done.resetHistory();
    query.reset();
    next.resetHistory();
    status.resetHistory();
    sinon.restore();
    sinon.reset();
  });
  it('Should call next with error if db.connect fails with error', () => {
    sinon.stub(db, 'connect').yields('error');
    createRide(req, res, next);
    expect(next).to.have.been.calledWith('error');
  });
  it('Should call next with error and done if first query fails with error', () => {
    query.yields('error1');
    sinon.stub(db, 'connect').yields(null, client, done);
    createRide(req, res, next);
    expect(next).to.have.been.calledWith('error1');
    expect(done).to.be.calledOnce;
    expect(res.status).to.not.be.called;
  });
  it('Should call next with error and call done if second query fails with error', () => {
    query.yields(null, { rows: {} });
    query.onSecondCall().yields('error2');
    sinon.stub(db, 'connect').yields(null, client, done);
    createRide(req, res, next);
    expect(next).to.have.been.calledWith('error2');
    expect(done).to.be.calledOnce;
    expect(res.status).to.not.be.called;
  });
});
