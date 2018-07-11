/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */

import sinon from 'sinon';

import sinonChai from 'sinon-chai';

import chai from 'chai';

import auth from '../../dbServer/middlewares/auth';

import db from '../../dbServer/db';

chai.use(sinonChai);

const { expect } = chai;

const { verifyTokenMware } = auth;

describe('Tests for auth middleware', () => {
  describe('Tests for auth.verifyTokenMware', () => {
    it('Should throw if no token in request header', () => {
      const req = { headers: {} };
      const next = sinon.spy();
      const querySpy = sinon.spy(db.query);
      expect(() => verifyTokenMware(req, null, next)).to.throw('No token');
      expect(next).to.not.have.been.called;
      expect(req).to.not.have.property('decoded');
      expect(querySpy).to.not.have.been.called;
    });

    it('Should call next with error if no such user in DB', () => {
      const req = {
        headers: {
          'x-access-token': 'sometoken',
        },
      };
      const response = {
        rows: { length: 0 },
      };
      sinon.stub(db, 'query').yields(null, response);
      const verifyStub = sinon.stub(auth, 'verifyToken');
      const next = sinon.spy();
      const decoded = {
        payload: { id: 2 },
      };
      verifyStub.withArgs(req.headers['x-access-token']).returns(decoded);
      verifyTokenMware(req, null, next);
      sinon.restore();
      expect(next).to.have.been.called;
      expect(verifyStub).to.have.been.calledWith(req.headers['x-access-token']);
      expect(req).to.not.have.property('decoded');
    });

    it('Calls next with error on db query error', () => {
      const req = {
        headers: {
          'x-access-token': 'tokensummer',
        },
      };

      sinon.stub(db, 'query').yields('error');
      const verifyStub = sinon.stub(auth, 'verifyToken');
      const next = sinon.spy();
      const decoded = {
        payload: { id: 2 },
      };
      verifyStub.withArgs(req.headers['x-access-token']).returns(decoded);
      verifyTokenMware(req, null, next);
      sinon.restore();
      expect(next).to.have.been.calledWith('error');
      expect(req).to.not.have.property('decoded');
    });
  });
});
