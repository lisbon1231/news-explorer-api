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

// const createArticles = async (req, res, next) => {
//   const {
//     keyword, title, text, date, source, link, image,
//   } = req.body;
//   // console.log(req.user);
//   const owner = req.user;
//   // console.log(req.body, ["coming from article"]);
//   try {
//     const articles = await Articles.create({
//       keyword, title, text, date, source, link, image, owner,
//     });
//     if (!articles) res.status(CODES.badRequest).send(ERRORS.articleValidation);

//     res.status(CODES.ok).send(articles);
//   } catch (error) {
//     next(error);
//   }
// };

const createArticles = (req, res, next) => {
  // console.log("createArticles");

  const {
    keyword, title, text, date, source, link, image,
  } = req.body;

  // console.log({ owner: req.user }, [858585]);
  Articles.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => {
      // console.log(typeof article.owner, article.owner, "i am here");
      res.status(CODES.ok).send(article);
    })
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  Articles.findById(req.params.articleId).then((article) => {
    if (article === null) {
      throw new NotFoundError(ERRORS.articleDoesNotExist);
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
