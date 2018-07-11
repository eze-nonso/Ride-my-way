/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */

import sinon from 'sinon';

import sinonChai from 'sinon-chai';

import chai from 'chai';

import errorHandler from '../../dbServer/middlewares/errorHandler';

chai.use(sinonChai);

const { expect } = chai;

describe('Tests for errorHandler', () => {
  it('Should call next with error if res.headersSent', () => {
    const next = sinon.spy();
    const res = { headersSent: true, status: () => ({ send() {} }) };
    sinon.spy(res, 'status');
    errorHandler('error', null, res, next);
    expect(next).to.have.been.calledWith('error');
    expect(res.status).to.not.have.been.called;
  });

  it('Should send 422 response code conditional on errors key', () => {
    const next = sinon.spy();
    const send = sinon.spy();
    const res = { status: () => ({ send }) };
    sinon.spy(res, 'status');
    const error = { errors: [], message: 'anError' };
    errorHandler(error, null, res, next);
    expect(next).to.not.have.been.called;
    expect(res.status).to.have.been.calledWith(422);
    expect(send).to.have.been.calledWithMatch({ message: error.message, errors: error.errors });
  });

  it('Should send status code or 500 response code if no errors key', () => {
    const next = sinon.spy();
    const send = sinon.spy();
    const error = { message: 'anError', status: 600 };
    const status = sinon.stub().withArgs(error.status || 500).returns({ send });
    const res = { status };
    errorHandler(error, null, res, next);
    expect(next).to.not.have.been.called;
    expect(status).to.have.been.calledWith(error.status);
    expect(send).to.have.been.calledWith({ message: error.message, serverError: false });

    delete error.status;
    errorHandler(error, null, res, next);
    expect(next).to.not.have.been.called;
    expect(status).to.have.been.calledWith(500);
    expect(send).to.have.been.calledWith({ message: error.message, serverError: error });
  });
});
