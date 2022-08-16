const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const { Schema } = mongoose;

const articleSchema = new Schema(
  {
    title: String, // String is shorthand for {type: String}
    author: String,
    body: String,
  },
  { timestamps: true }
);

articleSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
  deletedBy: true,
  deletedByType: String,
});

const Articles = mongoose.model("articles", articleSchema);

module.exports = Articles;
