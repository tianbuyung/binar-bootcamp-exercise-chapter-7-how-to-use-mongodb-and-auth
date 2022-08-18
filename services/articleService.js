const ArticleRepository = require("../repositories/articleRepository");
const articleRepository = new ArticleRepository();

class ArticleService {
  async createArticle(payload) {
    const conditions = payload.body;
    return await articleRepository.createArticle(conditions);
  }
  async viewAllArticles(payload) {
    return await articleRepository.viewArticles(payload);
  }
  async viewArticleWithAttributes(payload) {
    const conditions = { id: true };
    const attributes = { title: true };
    return await articleRepository.viewArticles(conditions, attributes);
  }
  async editArticle(payload) {
    const conditions = { _id: payload.params.id };
    const update = payload.body;
    return await articleRepository.editArticle(conditions, update);
  }
  async deleteArticle(payload) {
    const conditions = { _id: payload.params.id };
    return await articleRepository.deleteArticle(conditions);
  }
}

module.exports = ArticleService;
