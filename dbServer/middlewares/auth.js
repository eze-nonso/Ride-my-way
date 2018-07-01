import jwt from 'jsonwebtoken';

export default {
  authenticate(user) {
    const token = jwt.sign({
      id: user.id,
      email: user.email,
    }, process.env.SECRET, {
      expiresIn: '48h',
    });

    return token;
  },

  verifyToken(token) {
    let decoded = {};
    try {
      const payload = jwt.verify(token, process.env.SECRET);
      decoded.payload = payload;
    } catch (error) {
      decoded = {
        error: error.message,
      };
    }
    return decoded;
  },

  verifyTokenMware(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(403).send({
        msg: 'No token',
      });
    }
    const decoded = this.verifyToken(token);

    if (decoded.error) {
      return res.status(401).send({
        msg: decoded.error,
      });
    }

    req.decoded = decoded;
    return next();
  },
};

