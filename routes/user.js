const express = require("express");
// const { celebrate, Joi, Segments } = require("celebrate");

const router = express.Router();
const {
  getUserInfo,
} = require("../controllers/user");

router.get("/users/me", getUserInfo);

module.exports = router;
