const router = require("express").Router();
const { createUser, login } = require("../controllers/user");
const { validateUserCreation, validateSignin } = require("../middleware/celebrateValidators");

router.post("/signup", validateUserCreation, createUser);
router.post("/signin", validateSignin, login);

module.exports = router;
