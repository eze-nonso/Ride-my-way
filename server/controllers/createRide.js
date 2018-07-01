// import rideOffers from '../model/rideOffers';

import { connect } from '../db';

export default (req, res) => {
  const type = (param, typeOf) => {
    if (typeof param !== typeOf) {
      throw Error(`${param} should be type ${typeOf}`);
    }
    return true;
  };

  const {
    body: {
      driverName, destination, depart, date,
    },
  } = req;

  try {
    type(driverName, 'string');
    type(destination, 'string');
    type(depart, 'string');
    type(date, 'string');
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    });
  }

  return connect((error, client, done) => {
    if (error) throw error;
    client.query(
      'Insert into rides (user_id, destination, depart, date), values ($1, $2, $3, $4)',
      [1, destination, depart, date],
      (err2, res2) => {
        done();
        if (err2) {
          return res.status(400).json({
            err2,
          });
        }
        return res.status(201).json({
          newOffer: res2.rows,
        });
      },
    );
  });
};
