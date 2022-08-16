const ArticleService = require("../services/articleService");
const articleService = new ArticleService();

class ArticleController {
  async createArticle(req, res) {
    const payload = req;
    const [error, article] = await articleService.createArticle(payload);
    if (error) {
      res.status(400).json({
        message: error,
      });
    } else {
      res.status(200).json({
        message: "Successfully created article",
        article,
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
        message: "Successfully view all profile",
        article,
      });
    }
  }
  async editArticle(req, res) {
    const payload = req;
    const [error, article] = await articleService.editArticle(payload);
    if (error) {
      res.status(400).json({
        message: error,
      });
    } else {
      res.status(200).json({
        message: "Successfully edited article",
      });
    }
  }
  async deleteArticle(req, res) {
    const payload = req;
    const [error, article] = await articleService.deleteArticle(payload);
    if (error) {
      res.status(400).json({
        message: error,
      });
    } else {
      res.status(200).json({
        message: "Successfully deleted article",
      });
    }
  }
}

module.exports = ArticleController;
