const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const isEmail = require("validator/lib/isEmail");
const User = require("../models/User");
const ValidationError = require("../middleware/errors/ValidationError");
const NotFoundError = require("../middleware/errors/NotFoundError");

const { NODE_ENV, JWT_SECRET } = process.env;
const { ERRORS, CODES } = require("../utils/constants");

// getPromise.then((promise) => {
//   promise.then((data) => {
//     console.log(data);
//   })
// })

// const promise = await getPromise();
// const data = await promise();

const createUser = async (req, res, next) => {
  const { email, password, name } = req.body;

  if (!isEmail(email)) return res.status(CODES.badRequest).send(ERRORS.email);
  if (!password) return res.status(CODES.badRequest).send(ERRORS.password);

  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await User.findOne({ email });
    if (user) return res.status(CODES.conflict).send(ERRORS.exitingUser);

    const createdUser = await User.create({ email, password: hash, name });
    if (!createdUser) throw new ValidationError(ERRORS.userBadRequest);

    return res.status(CODES.created).send({ _id: createdUser._id, email: createdUser.email });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!isEmail(email)) throw new ValidationError(ERRORS.badCredentials);

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, NODE_ENV === "production" ? JWT_SECRET : "some-secret-key", { expiresIn: "7d" });
    res.cookie("jwt", token, { maxAge: 3600000 * 24 * 7, httpOnly: true });

    res.status(CODES.ok).send({ token });
  } catch (error) {
    next(error);
  }
};
const getUserInfo = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  try {
    if (!user) {
      throw new NotFoundError(ERRORS.userNotFound);
    }
    return res.status(CODES.ok).send(user);
  } catch (error) {
    next(error);
  }
  return user;
};

const getUsers = async (req, res, next) => {
  const user = await User.find({});
  try {
    if (!user) {
      throw new NotFoundError(ERRORS.userNotFound);
    }
    return res.status(CODES.ok).send({ data: user });
  } catch (error) {
    next(error);
  }
  return user;
};
module.exports = {
  login, createUser, getUserInfo, getUsers,
};
