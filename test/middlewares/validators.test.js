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

  it('Should populate req.body.email with error and throw if invalid email', () => {
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

  it('Should populate req.body.stringType with error and throw if not string type', () => {
    const notString = undefined;
    req.validateBody('type')
  })
});
