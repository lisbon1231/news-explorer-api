/* eslint-disable no-unused-vars */
// const { isCelebrateError } = require("celebrate");

// const { CODES, ERRORS } = require("../../utils/constants");

module.exports.handlingErrors = (err, req, res, next) => {
  if (err.name === "MongoError" && err.code === 11000) {
    res.status(409).send({ message: "Email already exists" });
  } else if (err.statusCode === undefined) {
    const { statusCode = 400, message } = err;
    res.status(statusCode).send({
      message: statusCode === 400 ? "Invalid data passed" : message,
    });
  } else {
    const { statusCode, message } = err;
    res.status(statusCode).send({ message });
  }
};
