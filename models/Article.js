const mongoose = require("mongoose");
const { default: validator } = require("validator");

const articleSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    select: false,
  },
  title: {
    type: String,
    required: true,
  },
  keyword: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v, [{ allow_underscores: true }]),
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /(https?:\/\/(www)?)+.+/g.test(v),
    },
  },
  date: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("article", articleSchema);
