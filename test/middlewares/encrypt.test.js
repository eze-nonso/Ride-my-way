import sinon from 'sinon';

import bcrypt from 'bcrypt';

import sinonChai from 'sinon-chai';

import chai from 'chai';

import encrypt from '../../dbServer/middlewares/encrypt';

chai.use(sinonChai);

const { expect } = chai;

const { hash } = encrypt;

describe('Tests for bcrypt encrypt middleware', () => {
  describe('Tests for encrypt hash function', () => {
    it('Should call next if req.body.password is null', () => {
      const req = {
        body: { password: undefined },
      };
      const hashSpy = sinon.spy(bcrypt.hash);
      const next = sinon.fake();
      hash(req, null, next);
      expect(next).to.have.been.called;
      expect(hashSpy).to.not.have.been.called;
    });

    it('Should call next with error on hashing error', () => {
      const req = {
        body: { password: 'validPass8!' },
      };
      const next = sinon.fake();
      sinon.stub(bcrypt, 'hash').yields('error');
      hash(req, null, next);
      // ensure to restore before any assertions
      sinon.restore();
      expect(next).to.have.been.calledWith('error');
    });

    it('Should set has to req.body.password and call next if no error', () => {
      const req = {
        body: { password: 'validPass8!' },
      };
      const next = sinon.spy();
      const hashed = 'valid89ujo8-8funnyi0y98--jhash';
      sinon.stub(bcrypt, 'hash').yields(null, hashed);
      hash(req, null, next);
      sinon.restore();
      expect(req.body).property('password', hashed);
      expect(next).to.have.been.calledOnce;
    });
  });
});
