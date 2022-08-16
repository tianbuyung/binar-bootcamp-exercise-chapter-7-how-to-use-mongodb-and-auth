const ArticleRepository = require("../repositories/articleRepository");
const articleRepository = new ArticleRepository();

class ArticleService {
  async createArticle(payload) {
    const conditions = payload.body;
    return await articleRepository.createArticle(conditions);
  }
  async viewArticle(payload) {
    return await articleRepository.viewArticle(payload);
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
