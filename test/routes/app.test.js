/* eslint-disable no-undef */

import chai from 'chai';

import chaiHttp from 'chai-http';

import app from '../../server/app';

const { expect } = chai;

chai.use(chaiHttp);

const api = `/api/${process.env.VERSION}`;

describe('Tests for welcome route', () => {
  it('Should send welcome message with status 200', (done) => {
    chai.request(app)
      .get(api)
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message').a('string');
        return done();
      });
  });
});

describe('Tests for error handler and not found handler', () => {
  it('Should send error 404 for route not found with status and data object', (done) => {
    chai.request(app)
      .get(`${api}/not/found`)
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(404);
        expect(res.body).property('status', 'error');
        expect(res.body).property('data').eql({ message: 'Page not found' });
        return done();
      });
  });
});
