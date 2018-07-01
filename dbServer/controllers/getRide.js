import db from '../db';

export default (req, res, next) => {
  if (!+req.params.rideId) {
    return next('route');
  }
  const rideId = +req.params.rideId;
  const query = {
    text: 'select * from rides',
  };
  return db.query(query, (error, response) => {
    if (error) throw error;
    const rides = response.rows;
    const rideOffer = rides.find(ride => ride.id === rideId);
    if (!rideOffer) {
      return res.status(400).json({
        message: 'Cannot get ride request',
      });
    }
    return res.status(200).json({
      ride: rideOffer,
    });
  });
};
