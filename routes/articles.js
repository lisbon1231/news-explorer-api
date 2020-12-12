const express = require("express");

const router = express.Router();

const {
  getArticles, deleteArticle, createArticles,
} = require("../controllers/articles");
// const auth = require("../middleware/auth");
const { createArticlesValidation, deleteArticleValidation } = require("../middleware/celebrateValidators");

router.get("/", getArticles);
router.delete("/:articleId", deleteArticleValidation, deleteArticle);
router.post("/", createArticlesValidation, createArticles);

module.exports = router;
