import db from '../db';

export default (req, res, next) => {
  if (!+req.params.rideId) {
    return next('route');
  }
  const rideId = parseInt(req.params.rideId, 10);

  const {
    decoded: {
      payload: { id },
    },
  } = req;

  db.connect((error, client, done) => {
    if (error) throw error;
    const query = {
      text: 'select * from rides where rides.id = $1',
      values: [rideId],
    };

    client.query(query, (error1, response1) => {
      if (error1) throw error1;
      if (!response1.rows.length) {
        const errorNoRide = Error(`Ride ${rideId} does not exist`);
        errorNoRide.status = 400;
        throw errorNoRide;
      }
      const query2 = {
        text: 'insert into requests (user_id, ride_id) values($1, $2)',
        values: [id, rideId],
      };

      client.query(query2, (error2, response2) => {
        done();
        if (error2) throw error2;
        const rideOffer = response2.rows[0];
        return res.status(200).send({
          ride: rideOffer,
        });
      });
    });
  });
};
