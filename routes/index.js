const router = require("express").Router();

const users = require("./user");
const articles = require("./articles");
const singInUp = require("./signInUp");

router.use("/", singInUp);
router.use("/", users);
router.use("/articles", articles);

module.exports = router;
