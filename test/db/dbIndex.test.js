import Seeder from '../../dbServer/seeders';

import db from '../../dbServer/db';

// eslint-disable-next-line prefer-arrow-callback
describe('Tests for database index file', function dIndex() {
  this.timeout(0);
  it('Should migrate models on first db query if tables not created', (done) => {
    Seeder.drop((error) => {
      if (error) return done(error);
      // tables dropped
      return db.query('Select from requests', done);
    });
  });

  it('Should migrate models on first db connect query if tables not created', (done) => {
    Seeder.drop((error) => {
      if (error) return done(error);
      // tables dropped
      return db.connect((error2, client, release) => {
        if (error2) return done(error2);
        return client.query('Select * from requests', release(done()));
      });
    });
  });
});
