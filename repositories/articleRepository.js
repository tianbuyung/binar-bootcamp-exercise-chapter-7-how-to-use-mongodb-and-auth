const Article = require("../models/Article");

class ArticleRepository {
  async createArticle(payload) {
    let err = null;
    try {
      const newArticle = await Article.create(payload);
      return [err, newArticle];
    } catch (error) {
      err = error;
      return [err, null];
    }
  }
  async viewArticle(payload) {
    let err = null;
    try {
      const article = await Article.find(payload);
      return [err, article];
    } catch (error) {
      err = error;
      return [err, null];
    }
  }
}
module.exports = ArticleRepository;
