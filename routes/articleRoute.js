const express = require("express");
const router = express.Router();

const ArticleController = require("../controllers/articleController");
const articleController = new ArticleController();

/* POST create a new article. */
router.post("/create", articleController.createArticle);
/* GET read all articles. */
router.get("/view", articleController.viewArticle);
/* PUT update a article. */
router.put("/edit/:id", articleController.editArticle);
/* DELETE update a article. */
router.delete("/delete/:id", articleController.deleteArticle);

module.exports = router;
