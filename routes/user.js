const express = require("express");

const router = express.Router();
const {
  getUserInfo,
  getUsers,
  getOneUser,
} = require("../controllers/user");
const auth = require("../middleware/auth");
const { validateUser } = require("../middleware/celebrateValidators");

router.get("/users", getUsers);
router.get("/users/me", auth, getUserInfo);

router.get("/users/:id", auth, validateUser, getOneUser);

module.exports = router;
