const Articles = require("../models/Article");
const ValidationError = require("../middleware/errors/ValidationError");
const NotFoundError = require("../middleware/errors/NotFoundError");
const ForbiddenError = require("../middleware/errors/ForbiddenError");

const getArticles = async (req, res, next) => {
  try {
    const articles = await Articles.find({});
    res.send({ data: articles });
  } catch (error) {
    next(error);
  }
};

const createArticles = async (req, res, next) => {
  const {
    keyword, title, text, data, source, link,
  } = req.body;
  const owner = req.user;
  try {
    const articles = await Articles.create({
      keyword, title, text, data, source, link, owner,
    });
    if (!articles) throw new ValidationError("Invalid data passed to the methods for creating an article");
    res.send(articles);
  } catch (error) {
    next(error);
  }
};

const deleteArticle = async (req, res, next) => {
  Articles.findById(req.params.articleId).then((article) => {
    if (article === null) {
      throw new NotFoundError("article not found");
    } else if (String(article.owner) !== req.user._id) {
      throw new ForbiddenError("User is not authorized for this method");
    } else {
      Articles.findByIdAndDelete(req.params.articleId)
        .then(() => res.send({ message: "Card deleted" }));
    }
  }).catch(next);
};

module.exports = {
  getArticles,
  deleteArticle,
  createArticles,
};
