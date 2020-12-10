const { isCelebrateError } = require("celebrate");

const { CODES, ERRORS } = require("../../utils/constants");

module.exports.handlingErrors = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    res.status(CODES.badRequest).send({ message: [...err.details.entries()][0][1] });
  }
  const { statusCode = CODES.ok, message } = err;
  res.status(statusCode)
    .send({ message: statusCode === ERRORS.internalServer ? ERRORS.internalServer : message });
  next(err);
};
