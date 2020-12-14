const express = require("express");

const router = express.Router();

const {
  getArticles, deleteArticle, createArticles,
} = require("../controllers/articles");
const auth = require("../middleware/auth");
const { createArticlesValidation, deleteArticleValidation } = require("../middleware/celebrateValidators");

router.get("/", auth, getArticles);
router.delete("/:articleId", auth, deleteArticleValidation, deleteArticle);
router.post("/", auth, createArticlesValidation, createArticles);

module.exports = router;
