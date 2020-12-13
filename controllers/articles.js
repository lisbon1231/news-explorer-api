const Articles = require("../models/Article");
const NotFoundError = require("../middleware/errors/NotFoundError");
const ForbiddenError = require("../middleware/errors/ForbiddenError");
const { ERRORS, CODES } = require("../utils/constants");

const getArticles = async (req, res, next) => {
  try {
    const articles = await Articles.find({});
    res.status(CODES.ok).send({ data: articles });
  } catch (error) {
    next(error);
  }
};

const createArticles = async (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  try {
    const articles = await Articles.create({
      keyword, title, text, date, source, link, image, owner: req.user._id,
    });
    if (!articles) res.status(CODES.badRequest).send(ERRORS.articleValidation);
    if (articles) res.status(CODES.ok).send(articles);
  } catch (error) {
    next(error);
  }
};

// const createArticles = (req, res, next) => {
//   const {
//     keyword, title, text, date, source, link, image,
//   } = req.body;
//   console.log({ owner: req }, [858585]);
//   Articles.create({
//     keyword, title, text, date, source, link, image, owner: req.user._id,
//   })
//     .then((article) => {
//       console.log(article);
//       res.status(CODES.ok).send(article);
//     })
//     .catch(next);
// };

const deleteArticle = async (req, res, next) => {
  Articles.findById(req.params.articleId).then((article) => {
    if (article === null) {
      throw new NotFoundError(ERRORS.notFound);
    } else if (String(article.owner) !== req.user._id) {
      throw new ForbiddenError(ERRORS.deleteArticlesOwn);
    } else {
      Articles.findByIdAndDelete(req.params.articleId)
        .then(() => res.status(CODES.ok).send(ERRORS.delete));
    }
  }).catch(next);
};

module.exports = {
  getArticles,
  deleteArticle,
  createArticles,
};
