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
  async viewArticles(conditions, attributes) {
    let err = null;
    try {
      const article = await Article.find(conditions, attributes);
      return [err, article];
    } catch (error) {
      err = error;
      return [err, null];
    }
  }
  async editArticle(conditions, update) {
    let err = null;
    try {
      const article = await Article.findOneAndUpdate(conditions, update);
      return [err, article];
    } catch (error) {
      err = error;
      return [err, null];
    }
  }
  async deleteArticle(conditions) {
    let err = null;
    try {
      const article = await Article.deleteById(conditions);
      return [err, article];
    } catch (error) {
      err = error;
      return [err, null];
    }
  }
}
module.exports = ArticleRepository;
