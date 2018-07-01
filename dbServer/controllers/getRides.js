import db from '../db';

export default (req, res) => {
  const { payload: { id, email } } = req.decoded;
  const query = {
    text: 'select * from rides inner join (select * from friends) as my_friends on rides.id = my_friends.ride_id',
  };
};

