const express = require("express");

const router = express.Router();

const {
  getArticles, deleteArticle, createArticles,
} = require("../controllers/articles");

router.get("/articles", getArticles);
router.delete("/articles/:articleId", deleteArticle);
router.post("/articles", createArticles);

module.exports = router;
