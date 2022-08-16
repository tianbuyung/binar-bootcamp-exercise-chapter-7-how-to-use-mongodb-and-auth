const express = require("express");
const router = express.Router();

const ArticleController = require("../controllers/articleController");
const articleController = new ArticleController();

const CheckAuthorization = require("../middleware/checkAuthorization");
const restrict = new CheckAuthorization();

const checkUserRole = require("../middleware/checkUserRole");

/* POST create a new article. */
router.post("/create", restrict.checkAuth, articleController.createArticle);
/* GET read all articles. */
router.get(
  "/view",
  restrict.checkAuth,
  checkUserRole,
  articleController.viewArticle
);
/* PUT update a article. */
router.put("/edit/:id", restrict.checkAuth, articleController.editArticle);
/* DELETE update a article. */
router.delete(
  "/delete/:id",
  restrict.checkAuth,
  articleController.deleteArticle
);

module.exports = router;
