const { NODE_ENV, SERVER_DB_ADDRESS } = process.env;

module.exports.DATABASE = NODE_ENV === "production" ? SERVER_DB_ADDRESS : "mongodb://localhost:27017/news";

module.exports.ERRORS = {
  notFound: "Requested resource not found.",
  unauthorized: "Authorization Required",
  deleteArticlesOwn: "Sorry you can only delete your own articles",
  internalServer: "An error has occurred on the server.",
  articleValidation: "Incorrect data passed to article",
  articleNotFound: "Article not found.",
  userNotFound: "User not found",
  emailNotUnique: "That email is already in use.",
  userBadRequest: "Data validation failed:  user cannot be created.",
  badCredentials: "Incorrect password or email.",
  email: "should be a valid email",
  password: "please enter a valid password",
  exitingUser: "user already exits",
};

module.exports.CODES = {
  ok: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  notFound: 404,
  conflict: 409,
  internalServer: 500,
};
