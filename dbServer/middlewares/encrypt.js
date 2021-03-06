import bcrypt from 'bcrypt';

const { env: { SALT: salt } } = process;

export default {
  hash(req, res, next) {
    if (req.body.password == null) return next();
    return bcrypt.hash(req.body.password, parseInt(salt, 10), (error, hash) => {
      if (error) return next(error);
      req.body.password = hash;
      return next();
    });
  },

  compare(req, hash, callback) {
    return bcrypt.compare(req.body.password, hash, callback);
  },
};
