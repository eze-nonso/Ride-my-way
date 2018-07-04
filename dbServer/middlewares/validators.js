export default {
  notNull(...datas) {
    const notNull = Error('Validation error');
    notNull.errors = [];
    return (req, res, next) => {
      datas.forEach((data) => {
        if (req.body[data] == null) {
          console.log(req.body[data])
          notNull.errors.push(`'${data}' cannot be null`);
        }
      });
      return notNull.errors.length
        ? next(notNull)
        : next();
    };
  },
};
