exports.postgresErrorHandler = (err, req, res, next) => {
  //   console.log(err.code, "<<< Err code");
  if (err.code === '22P02' || err.code === '23502' || err.code === '23503') {
    res.status(400).send({ msg: 'Bad request' });
  } else {
    next(err);
  }
};

exports.customErrorHandler = (err, req, res, next) => {
  if (err.status && err.msg) {
    console.log(err, '<<< Err code');
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.serverErrorHandler = (err, req, res, next) => {
  res.status(500).send({ msg: 'Internal Server Error' });
};
