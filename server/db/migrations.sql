CREATE TABLE IF NOT EXISTS users(
  id int primary key not null,
  email citext not null unique,
  name varchar(30) not null unique,
  phone varchar(16) unique,
  city varchar(20),
  carId int references car(id) on update cascade on delete set null
);

CREATE TABLE IF NOT EXISTS rides(
  id int primary key not null,
  user_id int references users(id) on update cascade on delete cascade,
  destination text not null,
  departure_time timestamp not null,
  date timestamp not null
);

CREATE TABLE IF NOT EXISTS requests(
  id int primary key not null,
  ride_id int references rides(id) on update cascade on delete set null,
  user_id int references users(id) on update cascade on delete cascade,
  destination text not null,
  depart text not null,
  date timestamp not null,
  city_to varchar(30) not null,
  city_from varchar(30) not null
);

CREATE TABLE IF NOT EXISTS CAR(
  id int primary key not null,
  make varchar not null,
  model varchar not null
);
