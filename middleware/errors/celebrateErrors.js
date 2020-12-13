const { CODES, ERRORS } = require("../../utils/constants");

module.exports.handlingErrors = (err, req, res, next) => {
  const { statusCode = CODES.internalServer, message } = err;
  res.status(statusCode).send({
    message: statusCode === CODES.internalServer
      ? ERRORS.internalServer
      : message,
  });
  next();
};
