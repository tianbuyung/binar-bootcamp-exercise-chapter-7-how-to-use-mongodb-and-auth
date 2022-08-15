const mongoose = require("mongoose");

const { Schema } = mongoose;

const articleSchema = new Schema(
  {
    title: String, // String is shorthand for {type: String}
    author: String,
    body: String,
  },
  { timestamps: true }
);

const article = mongoose.model("Article", articleSchema);

module.exports = article;
