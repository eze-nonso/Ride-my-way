/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */

import sinon from 'sinon';

import sinonChai from 'sinon-chai';

import chai from 'chai';

import proxyquire from 'proxyquire';

const db = { connect: () => {}, query: () => {} };

const Seeder = proxyquire('../../dbServer/seeders', {
  '../db': {
    default: db,
  },
}).default;

chai.use(sinonChai);

const { expect } = chai;

describe('Tests for seeder index', () => {
  describe('Tests for Seeder.populate', () => {
    const done = sinon.spy();
    afterEach('Clear all stubs', () => {
      sinon.restore();
      done.resetHistory();
    });
    it('Should call callback with error if db connect fails with an error', () => {
      const callback = sinon.spy();
      sinon.stub(db, 'connect').yields('error');
      Seeder.populate(callback);
      expect(callback).to.have.been.calledOnceWith('error');
    });
    it('Should call callback with error if first client query fails with an error', () => {
      const callback = sinon.spy();
      const client = { query: sinon.stub().yields('error1') };
      sinon.stub(db, 'connect').yields(null, client, done);
      Seeder.populate(callback);
      expect(callback).to.have.been.calledWith('error1');
      expect(done).to.have.been.calledOnce;
    });
    it('Should call callback with error if db second client query fails with an error', () => {
      const callback = sinon.spy();
      const query = sinon.stub();
      query.yields(null);
      query.onSecondCall().yields('error2');
      const client = { query };
      sinon.stub(db, 'connect').yields(null, client, done);
      Seeder.populate(callback);
      expect(callback).to.have.been.calledWith('error2');
      expect(done).to.have.been.calledOnce;
    });
    it('Should call callback with error if db third client query fails with an error', () => {
      const callback = sinon.spy();
      const query = sinon.stub();
      query.yields(null);
      query.onThirdCall().yields('error3');
      const client = { query };
      sinon.stub(db, 'connect').yields(null, client, done);
      Seeder.populate(callback);
      expect(callback).to.have.been.calledWith('error3');
      expect(done).to.have.been.calledOnce;
    });
    it('Should call callback with error if db fourth client query fails with an error', () => {
      const callback = sinon.spy();
      const query = sinon.stub();
      query.yields(null);
      query.onCall(3).yields('error4');
      const client = { query };
      sinon.stub(db, 'connect').yields(null, client, done);
      Seeder.populate(callback);
      expect(callback).to.have.been.calledWith('error4');
      expect(done).to.have.been.calledOnce;
    });
  });

  describe('Tests for Seeder.delete', () => {
    const done = sinon.spy();
    beforeEach('Clear spy history', () => {
      sinon.resetBehavior();
    });
    afterEach('Clear all stubs', () => {
      sinon.restore();
      done.resetHistory();
    });
    it('Should call callback with error if db connect fails with an error', () => {
      const callback = sinon.spy();
      sinon.stub(db, 'connect').yields('error');
      Seeder.delete(callback);
      expect(callback).to.have.been.calledOnceWith('error');
    });
    it('Should call callback with error if first client query fails with an error', () => {
      const callback = sinon.spy();
      const client = { query: sinon.stub().yields('error1') };
      sinon.stub(db, 'connect').yields(null, client, done);
      Seeder.delete(callback);
      expect(callback).to.have.been.calledWith('error1');
      expect(done).to.have.been.calledOnce;
    });
    it('Should call callback with error if db second client query fails with an error', () => {
      const callback = sinon.spy();
      const query = sinon.stub();
      query.yields(null);
      query.onSecondCall().yields('error2');
      const client = { query };
      sinon.stub(db, 'connect').yields(null, client, done);
      Seeder.delete(callback);
      expect(callback).to.have.been.calledWith('error2');
      expect(done).to.have.been.calledOnce;
    });
    it('Should call callback with error if db third client query fails with an error', () => {
      const callback = sinon.spy();
      const query = sinon.stub();
      query.yields(null);
      query.onThirdCall().yields('error3');
      const client = { query };
      sinon.stub(db, 'connect').yields(null, client, done);
      Seeder.delete(callback);
      expect(callback).to.have.been.calledWith('error3');
      expect(done).to.have.been.calledOnce;
    });
    it('Should call callback with error if db fourth client query fails with an error', () => {
      const callback = sinon.spy();
      const query = sinon.stub();
      query.yields(null);
      query.onCall(3).yields('error4');
      const client = { query };
      sinon.stub(db, 'connect').yields(null, client, done);
      Seeder.delete(callback);
      expect(callback).to.have.been.calledWith('error4');
      expect(done).to.have.been.calledOnce;
    });
    it('Should call callback with error if db fifth client query fails with an error', () => {
      const callback = sinon.spy();
      const query = sinon.stub();
      query.yields(null);
      query.onCall(4).yields('error5');
      const client = { query };
      sinon.stub(db, 'connect').yields(null, client, done);
      Seeder.delete(callback);
      expect(callback).to.have.been.calledWith('error5');
      expect(done).to.have.been.calledOnce;
    });
    it('Should call callback with error if db sixth client query fails with an error', () => {
      const callback = sinon.spy();
      const query = sinon.stub();
      query.yields(null);
      query.onCall(5).yields('error6');
      const client = { query };
      sinon.stub(db, 'connect').yields(null, client, done);
      Seeder.delete(callback);
      expect(callback).to.have.been.calledWith('error6');
      expect(done).to.have.been.calledOnce;
    });
    it('Should call callback with error if db seventh client query fails with an error', () => {
      const callback = sinon.spy();
      const query = sinon.stub();
      query.yields(null);
      query.onCall(6).yields('error7');
      const client = { query };
      sinon.stub(db, 'connect').yields(null, client, done);
      Seeder.delete(callback);
      expect(callback).to.have.been.calledWith('error7');
      expect(done).to.have.been.calledOnce;
    });
    it('Should call callback with error if db eight client query fails with an error', () => {
      const callback = sinon.spy();
      const query = sinon.stub();
      query.yields(null);
      query.onCall(7).yields('error8');
      const client = { query };
      sinon.stub(db, 'connect').yields(null, client, done);
      Seeder.delete(callback);
      expect(callback).to.have.been.calledWith('error8');
      expect(done).to.have.been.calledOnce;
    });
  });

  describe('Tests for Seeder.drop', () => {
    const callback = sinon.spy();
    afterEach('Clear stub', () => {
      sinon.restore();
      callback.resetHistory();
    });
    it('Should call callback with error if db.connect fails with error', () => {
      const done = sinon.spy();
      sinon.stub(db, 'connect').yields('error');
      Seeder.drop(callback);
      expect(callback).to.have.been.calledWith('error');
      expect(done.notCalled).true;
    });
    it('Should call callback with error if first client.query errors out', () => {
      const query = sinon.stub();
      const client = { query };
      const done = sinon.spy();
      sinon.stub(db, 'connect').yields(null, client, done);
      query.yields('error1');
      Seeder.drop(callback);
      expect(callback).to.have.been.calledWith('error1');
      expect(done.calledOnce).true;
    });
    it('Should call callback with error if second client.query errors out', () => {
      const query = sinon.stub();
      const client = { query };
      const done = sinon.spy();
      sinon.stub(db, 'connect').yields(null, client, done);
      query.yields(null);
      query.onSecondCall().yields('error2');
      Seeder.drop(callback);
      expect(callback).to.have.been.calledWith('error2');
      expect(done.calledOnce).true;
    });
    it('Should call callback with error if third client.query errors out', () => {
      const query = sinon.stub();
      const client = { query };
      const done = sinon.spy();
      sinon.stub(db, 'connect').yields(null, client, done);
      query.yields(null);
      query.onThirdCall().yields('error3');
      Seeder.drop(callback);
      expect(callback).to.have.been.calledWith('error3');
      expect(done.calledOnce).true;
    });
    it('Should call callback with error if fourth client.query errors out', () => {
      const query = sinon.stub();
      const client = { query };
      const done = sinon.spy();
      sinon.stub(db, 'connect').yields(null, client, done);
      query.yields(null);
      query.onCall(3).yields('error4');
      Seeder.drop(callback);
      expect(callback).to.have.been.calledWith('error4');
      expect(done.calledOnce).true;
    });
    it('Should call callback if no errors on db.connect and on all queries', () => {
      const query = sinon.stub();
      const client = { query };
      const done = sinon.spy();
      sinon.stub(db, 'connect').yields(null, client, done);
      query.yields(null);
      Seeder.drop(callback);
      expect(callback).to.have.been.called;
      expect(done.calledOnce).true;
    });
  });
});
