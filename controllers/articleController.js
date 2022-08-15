const ArticleService = require("../services/articleService");
const articleService = new ArticleService();

class ArticleController {
  async createArticle(req, res) {
    const payload = req.body;
    const [error, article] = await articleService.createArticle(payload);
    if (error) {
      res.status(400).json({
        message: error,
      });
    } else {
      res.status(200).json({
        message: article,
      });
    }
  }
  async viewArticle(req, res) {
    const [error, article] = await articleService.viewArticle();
    if (error) {
      res.status(400).json({
        message: error,
      });
    } else {
      res.status(200).json({
        message: article,
      });
    }
  }
}

module.exports = ArticleController;
