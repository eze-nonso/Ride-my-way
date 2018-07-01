import db from '../db';

export default (req, res) => {
  const query = {
    text: 'select * from rides',
  };
  db.query(query, (error, response) => {
    if (error) throw error;
    const rides = response.rows;
    return res.status(200).send({
      rides,
    });
  });
};

