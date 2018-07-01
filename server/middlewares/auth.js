import jwt from 'jsonwebtoken';

export default class Auth {
  static authenticate(user) {
    const token = jwt.sign({
      id: user.id,
      email: user.email,
    }, process.env.SECRET, {
      expiresIn: '48h',
    });

    return token;
  }
}
