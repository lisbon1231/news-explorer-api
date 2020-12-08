const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const isEmail = require("validator/lib/isEmail");
const User = require("../models/User");
const ValidationError = require("../middleware/errors/ValidationError");
const NotFoundError = require("../middleware/errors/NotFoundError");

const { NODE_ENV, JWT_SECRET } = process.env;

// getPromise.then((promise) => {
//   promise.then((data) => {
//     console.log(data);
//   })
// })

// const promise = await getPromise();
// const data = await promise();

const createUser = async (req, res, next) => {
  const { email, password, name } = req.body;

  if (!isEmail(email)) return res.send('email doesn"t work');
  if (!password) return res.send('password doesn"t work');

  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await User.findOne({ email });
    if (user) return res.status(409).send({ message: "User already exists!!!" });

    const createdUser = await User.create({ email, password: hash, name });
    if (!createdUser) throw new ValidationError("invalid data passed to the method for creating user");

    return res.status(201).send({ _id: createdUser._id, email: createdUser.email });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!isEmail(email)) throw new ValidationError("Incorrect Email or Password");

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, NODE_ENV === "production" ? JWT_SECRET : "some-secret-key", { expiresIn: "7d" });
    res.cookie("jwt", token, { maxAge: 3600000 * 24 * 7, httpOnly: true });

    res.send({ token });
  } catch (error) {
    next(error);
  }
};
// const login = (req, res, next) => {
//   const { email, password } = req.body;

//   if (!isEmail(email)) {
//     throw new ValidationError("Incorrect Email or Password");
//   }
//   return User.findUserByCredentials(email, password).then((user) => {
//     const token = jwt.sign({ _id: user._id },
// NODE_ENV === "production" ? JWT_SECRET : "some-secret-key", { expiresIn: "7d" });
//     res.cookie("jwt", token, {
//       maxAge: 3600000 * 24 * 7,
//       httpOnly: true,
//     });
//     res.send({ token });
//   }).catch(next);
// };

const getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) throw new NotFoundError("User not found");
    res.send(user);
  } catch (error) {
    next(error);
  }
};
// const getUserInfo = (req, res, next) => {
//   User.findById(req.user._id).then((user) => {
//     if (!user) {
//       throw new NotFoundError("User not found");
//     }
//     res.send(user);
//   })
//     .catch(next);
// };

module.exports = {
  login, createUser, getUserInfo,
};
