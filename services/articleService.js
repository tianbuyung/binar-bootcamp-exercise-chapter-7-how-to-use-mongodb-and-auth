const ArticleRepository = require("../repositories/articleRepository");
const articleRepository = new ArticleRepository();

class ArticleService {
  async createArticle(payload) {
    return await articleRepository.createArticle(payload);
  }
  async viewArticle(payload) {
    return await articleRepository.viewArticle(payload);
  }
}

module.exports = ArticleService;
