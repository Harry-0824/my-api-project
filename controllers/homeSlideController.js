const { HomeSlide } = require("../models");

// 取得所有首頁輪播圖
exports.getAllSlides = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    if (page > 0 && limit > 0) {
      const offset = (page - 1) * limit;
      const { count, rows } = await HomeSlide.findAndCountAll({
        order: [["order", "ASC"]],
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

    const slides = await HomeSlide.findAll({
      order: [["order", "ASC"]],
    });
    res.json({ success: true, data: slides });
  } catch (err) {
    console.error("取得輪播圖失敗:", err);
    res.status(500).json({ success: false, message: "伺服器內部錯誤" });
  }
};

// 新增首頁輪播圖 (管理介面使用)
exports.createSlide = async (req, res) => {
  try {
    const newSlide = await HomeSlide.create(req.body);
    res.status(201).json({ success: true, data: newSlide });
  } catch (err) {
    console.error("新增輪播圖失敗:", err);
    res.status(500).json({ success: false, message: "伺服器內部錯誤" });
  }
};
