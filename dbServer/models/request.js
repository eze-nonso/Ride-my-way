export default (db, callback) => {
  const query = {
    text: `Create table IF NOT EXISTS requests(
      id SERIAL PRIMARY KEY not null,
      accepted BOOLEAN DEFAULT null,
      ride_id INT references rides(id) on update cascade on delete set null,
      user_id INT references users(id) on update cascade on delete cascade,
      deleted BOOLEAN default false,
      unique(user_id, ride_id)
    )`,
  };

  db.query(query, (error) => {
    if (error) throw error;
    if (callback && typeof callback === 'function') callback();
  });
};
