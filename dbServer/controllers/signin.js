import db from '../db';

import auth from '../middlewares/auth';

export default (req, res) => {
  const query = {
    text: 'select id, first_name, last_name, email, password from users where email = $1 LIMIT 1',
    values: [
      req.body.email,
    ],
  };

  db.query(query, (error, response) => {
    if (error) throw error;
    const user = response.rows[0];
    if (!user) {
      return res.status(401).send({
        message: 'Invalid email',
      });
    }
    return auth.compare(req, user.password, (err, result) => {
      if (err) throw err;
      if (result) {
        const token = auth.authenticate(user);
        return res.status(200).send({
          user, token,
        });
      }
      return res.status(401).send({
        message: 'Invalid password',
      });
    });
  });
};
