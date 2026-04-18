const { Article } = require("../models");

// 取得所有文章
exports.getAllArticles = async (req, res) => {
  try {
    const { category } = req.query;
    const where = {};
    if (category) {
      where.category = category;
    }

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    if (page > 0 && limit > 0) {
      const offset = (page - 1) * limit;
      const { count, rows } = await Article.findAndCountAll({
        where,
        order: [["date", "DESC"]],
        offset,
        limit,
      });
      return res.json({
        success: true,
        data: rows,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      });
    }

    const articles = await Article.findAll({
      where,
      order: [["date", "DESC"]],
    });
    res.json({ success: true, data: articles });
  } catch (err) {
    console.error("取得文章失敗:", err);
    res.status(500).json({ success: false, message: "伺服器內部錯誤" });
  }
};

// 根據 ID 取得單一文章
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: "找不到該文章" });
    }
    res.json({ success: true, data: article });
  } catch (err) {
    console.error("取得文章失敗:", err);
    res.status(500).json({ success: false, message: "伺服器內部錯誤" });
  }
};

// 新增文章
exports.createArticle = async (req, res) => {
  try {
    const newArticle = await Article.create(req.body);
    res.status(201).json({ success: true, data: newArticle });
  } catch (err) {
    console.error("新增文章失敗:", err);
    res.status(500).json({ success: false, message: "伺服器內部錯誤" });
  }
};
