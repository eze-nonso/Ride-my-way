import db from '../db';

export default [
  (req, res, next) => {
    req.validateBody('notEmpty')(
      'stateFrom', 'stateTo',
      'cityTo', 'cityFrom', 'departureDate',
      'departureTime', 'pickupLocation',
      'price',
    );
    req.validateBody('notEmptyString')(
      'stateFrom', 'stateTo',
      'cityTo', 'cityFrom', 'departureDate',
      'departureTime', 'pickupLocation',
    );
    req.validateBody('type', 'date')(req.body.departureDate);
    return req.sendErrors(next);
  },
  (req, res, next) => {
    const {
      body: {
        stateFrom, cityFrom,
        stateTo, cityTo,
        price, departureDate,
        departureTime, pickupLocation,
      },
      decoded: { payload: { id } },
    } = req;

    db.connect((error, client, done) => {
      if (error) return next(error);
      // no rides created within an hour of each other
      const query1 = {
        text: `select * from rides 
        where age(concat_ws(
          ' ', rides.departure_date,
          rides.departure_time
        )::timestamp, 
        concat_ws(
          ' ', $1::varchar,
          $2::varchar
        )::timestamp) 
        between interval '-1 hour'
        and interval '1 hour'
        and rides.deleted is not true`,
        values: [departureDate, departureTime],
      };
      return client.query(query1, (error1, response1) => {
        if (error1) return done(next(error1));
        if (response1.rows.length) {
          res.status(409).send({
            message: 'Existing ride within 1 hour of new Ride',
            conflictingRide: response1.rows[0],
          });
          return done();
        }

        // check ride exists but deleted
        const query2 = {
          text: `update rides
          set departure_date = $1::date,
          departure_time = $2::time,
          price = $3, deleted = false,
          pickup_location = $4 where id in
          (select id from rides 
          where deleted
          is true and state_from = $5
          and state_to = $6
          and city_from = $7
          and city_to = $8
          and age(
            concat_ws(
              ' ', departure_date,
              departure_time
            )::timestamp,
            concat_ws(
              ' ', $1::text, $2::text
            )::timestamp
          ) between
          interval '- 1 hour' and
          interval '1 hour'
          and user_id = $9 LIMIT 1)
          returning *`,
          values: [
            departureDate, departureTime,
            price, pickupLocation,
            stateFrom, stateTo, cityFrom,
            cityTo, id,
          ],
        };

        return client.query(query2, (error2, response2) => {
          if (error2) return done(next(error2));
          if (response2.rows.length) {
            return res.status(201).send({
              ride: response2.rows[0],
            });
          }
          const query3 = {
            text: `insert into rides (
            state_from, city_from, state_to,
            city_to, price, departure_date,
            departure_time, pickup_location, user_id
            ) 
            values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            returning *`,
            values: [
              stateFrom, cityFrom, stateTo,
              cityTo, price, departureDate,
              departureTime, pickupLocation, id,
            ],
          };
          return client.query(query3, (error3, response3) => {
            done();
            if (error3) return next(error3);
            return res.status(201).send({
              ride: response3.rows[0],
            });
          });
        });
      });
    });
  }];
