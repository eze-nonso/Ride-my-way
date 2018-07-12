/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */

import sinon from 'sinon';

import sinonChai from 'sinon-chai';

import chai from 'chai';

import user from '../../dbServer/models/user';

chai.use(sinonChai);

const { expect } = chai;

describe('Tests for car model', () => {
  const db = { connect: () => {} };
  const callback = sinon.spy();
  const done = sinon.spy();
  beforeEach('Clear spy and stub histores, restore stubbed', () => {
    sinon.restore();
    callback.resetHistory();
    done.resetHistory();
  });
  it('Should throw error if db connect fails with an error', () => {
    sinon.stub(db, 'connect').yields('error');
    expect(() => user(db, callback)).to.throw('error');
    expect(callback).to.not.have.been.called;
  });
  it('Should call done and throw error if first client query fails with error', () => {
    const client = { query: sinon.stub().yields('error2') };
    sinon.stub(db, 'connect').yields(null, client, done);
    expect(() => user(db, callback)).to.throw('error2');
    expect(done).to.have.been.calledOnce;
    expect(callback).to.not.have.been.called;
  });

  it('Should throw error if second client query fails with an error', () => {
    const query = sinon.stub();
    const client = { query };
    query.onFirstCall().yields(null);
    query.onSecondCall().yields('error3');
    sinon.stub(db, 'connect').yields(null, client, done);
    expect(() => user(db, callback)).to.throw('error3');
    expect(done).to.have.been.calledOnce;
    expect(callback).to.not.have.been.called;
  });
  it('Should call callback if callback is of function type and no query errors', () => {
    const query = sinon.stub();
    const client = { query };
    query.onFirstCall().yields(null);
    query.onSecondCall().yields(null);
    sinon.stub(db, 'connect').yields(null, client, done);
    expect(() => user(db, callback)).to.not.throw();
    expect(done).to.have.been.calledOnce;
    expect(callback).to.have.been.calledOnce;
  });
  it('Should not call callback of non function type', () => {
    const query = sinon.stub();
    const client = { query };
    query.onFirstCall().yields(null);
    query.onSecondCall().yields(null);
    sinon.stub(db, 'connect').yields(null, client, done);
    expect(() => user(db, 'nonFunc')).to.not.throw();
    expect(done).to.have.been.calledOnce;
  })
});
