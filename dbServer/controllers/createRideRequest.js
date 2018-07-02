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

  return db.connect((error, client, done) => {
    if (error) return next(error);
    const query = {
      text: 'select * from rides where rides.id = $1',
      values: [rideId],
    };

    return client.query(query, (error1, response1) => {
      if (error1) return next(error1);
      if (!response1.rows.length) {
        const errorNoRide = Error(`Ride ${rideId} does not exist`);
        errorNoRide.status = 400;
        return next(errorNoRide);
      }
      const query2 = {
        text: 'insert into requests (user_id, ride_id) values($1, $2) returning *',
        values: [id, rideId],
      };

      return client.query(query2, (error2, response2) => {
        done();
        if (error2) return next(error2);
        const rideRequest = response2.rows[0];
        return res.status(200).send({
          ride: rideRequest,
        });
      });
    });
  });
};
