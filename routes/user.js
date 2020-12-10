const express = require("express");

const router = express.Router();
const {
  getUserInfo,
  getUsers,
} = require("../controllers/user");
const auth = require("../middleware/auth");
const { validateUser } = require("../middleware/celebrateValidators");

router.get("/users", getUsers);

router.get("/users/:id", auth, validateUser, getUserInfo);

module.exports = router;
