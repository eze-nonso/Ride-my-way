import db from '../db';

import auth from '../middlewares/auth';

export default (req, res) => {
  const query = {
    text: 'insert into car (model, make) values($1, $2)',
    values: [req.body.car_model, req.body.car_make],
  };

  db.connect((error, client, done) => {
    if (error) throw error;
    client.query(query, (error2, res2) => {
      if (error2) throw error2;
      const carId = res2.rows[0].id;

      const query2 = {
        text: 'insert into users (email, firstname, lastname, phone, password, city, state, car_id) values ($1, $2, $3, $4, $5, $6, $7, $8)',
        values: [
          req.body.email, req.body.firstname,
          req.body.lastname, req.body.phone,
          req.body.password, req.body.city,
          req.body.state, carId,
        ],
      };

      client.query(query2, (error3, res3) => {
        done();
        if (error3) throw error3;
        const newUser = res3.rows[0];
        const token = auth.authenticate(newUser);
        res.status(201).send({
          user: newUser,
          token,
        });
      });
    });
  });
};
