const express = require("express");
const router = express.Router();

const ArticleController = require("../controllers/articleController");
const articleController = new ArticleController();

/* POST create a new article. */
router.post("/create", articleController.createArticle);
/* POST create a new article. */
router.get("/", articleController.viewArticle);

module.exports = router;
