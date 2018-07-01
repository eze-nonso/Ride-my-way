import { connect } from '../db';

export default (req, res) => {
  connect((err, client, done) => {
    if (err) throw err;
    client.query('Select * from rides', [], (error, response) => {
      done();
      if (error) {
        return res.staus(500).json({
          message: error.message,
        });
      }
      return res.status(200).json({
        rideOffers: response.rows,
      });
    });
  });
};

