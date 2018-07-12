/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */

import sinon from 'sinon';

import sinonChai from 'sinon-chai';

import chai from 'chai';

import ride from '../../dbServer/models/ride';

chai.use(sinonChai);

const { expect } = chai;

describe('Tests for car model', () => {
  const db = { query: () => {} };
  const callback = sinon.spy();
  beforeEach('Clear spy and stub histories', () => {
    callback.resetHistory();
    sinon.restore();
  });
  it('Should throw error if db query fails with an error', () => {
    sinon.stub(db, 'query').yields('error');
    expect(() => ride(db, callback)).to.throw('error');
    expect(callback).to.not.have.been.called;
  });
  it('Should invoke the callback of function type when no error argument', () => {
    sinon.stub(db, 'query').yields(null);
    expect(() => ride(db, callback)).to.not.throw();
    expect(callback).to.have.been.called;
  });
  it('Should not invoke callback of non function type', () => {
    sinon.stub(db, 'query').yields(null);
    expect(() => ride(db)).to.not.throw();
  });
});
