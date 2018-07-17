/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */

import sinon from 'sinon';

import sinonChai from 'sinon-chai';

import chai from 'chai';

import validator from '../../dbServer/middlewares/validators';

chai.use(sinonChai);

const { expect } = chai;

const req = { body: {} };

const next = sinon.fake();

describe('Tests for validator', () => {
  beforeEach('Set up request object with validator methods', () => {
    validator(req, null, next);
    next.resetHistory();
  });

  describe('Tests for email validator', () => {
    it('Should populate req.body.errors.email with error and throw if invalid email', () => {
      const email = 'notValidMail';
      req.body.email = email;
      req.validateBody('email')();
      expect(() => req.sendErrors(next)).to.throw('Validation error');
      expect(req.body.errors).to.have.property('email').lengthOf(1);
      expect(next).to.not.have.been.called;
    });

    it('Should call next for valid email', () => {
      const email = 'valid@gm.com';
      req.body.email = email;
      expect(() => req.sendErrors(next)).to.not.throw();
      expect(req.body.errors).to.have.property('email').empty;
      expect(next).to.have.been.called;
    });
  });

  describe('Tests for stringtype validator', () => {
    it('Should populate req.body.errors.stringType with error and throw if not string type', () => {
      const notString = undefined;
      req.validateBody('type', 'string')(notString);
      expect(() => req.sendErrors(next)).to.throw();
      expect(next).to.not.have.been.called;
      expect(req.body.errors).to.have.property('stringType').length(1);
    });

    it('Should call next for valid stringType', () => {
      const validString = 'helloWorld';
      req.validateBody('type', 'string')(validString);
      expect(() => req.sendErrors(next)).to.not.throw();
      expect(req.body.errors).to.have.property('stringType').empty;
      expect(next).to.have.been.called;
    });
  });

  describe('Tests for notEmptyString validator', () => {
    it('Should populate req.body.errors.notEmptyString with error and throw if empty string', () => {
      req.body.emptyString = '   ';
      req.validateBody('notEmptyString')('emptyString');
      expect(() => req.sendErrors(next)).to.throw();
      expect(next).to.not.have.been.called;
      expect(req.body.errors).to.have.property('notEmptyString').lengthOf(1);
    });
  });

  describe('Tests for password type', () => {
    it('Should populate req.body.errors.passwordType with error and throw for invalid password', () => {
      const pwd = '108kf';
      req.validateBody('type', 'password')(pwd);
      expect(() => req.sendErrors(next)).to.throw();
      expect(next).to.not.have.been.called;
      expect(req.body.errors).to.have.property('passwordType').lengthOf(1);
    });
  });

  describe('Tests for dateType validator', () => {
    it('Should populate req.body.errors.dateType with error and throw for invalid date string', () => {
      const date = '10/18:hello16';
      req.validateBody('type', 'date')(date);
      expect(() => req.sendErrors(next)).to.throw();
      expect(next).to.not.have.been.called;
      expect(req.body.errors).to.property('dateType').lengthOf(1);
    });
  });
});
