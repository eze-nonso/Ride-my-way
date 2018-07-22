import db from '../db';

export default (req, res, next) => {
  const {
    decoded: { payload: { id: userId } },
  } = req;
  const query = {
    text: `select concat_ws(
      ' ', users.firstname, users.lastname
    ) as requester,
    concat_ws(
      ' ', owners.firstname, owners.lastname
    ) as ride_owner, requests.*,
    rides.state_from, rides.state_to,
    rides.city_from, rides.city_to,
    rides.price, rides.departure_date,
    rides.departure_time, rides.pickup_location
    from requests
    inner join users on
    requests.user_id = users.id
    inner join rides
    on requests.ride_id = rides.id
    inner join users as owners
    on rides.user_id = owners.id
    and owners.id = $1`,
    values: [+userId],
  };
  db.query(query, (error, response) => {
    if (error) return next(error);
    const requests = response.rows;
    return res.status(200).send({
      requests,
    });
  });
};
