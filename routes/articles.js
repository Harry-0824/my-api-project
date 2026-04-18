const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articleController");
const checkAuth = require("../middleware/check-auth");

router.get("/", articleController.getAllArticles);
router.get("/:id", articleController.getArticleById);
router.post("/", checkAuth, articleController.createArticle);

module.exports = router;
