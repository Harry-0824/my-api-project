const { HomeSlide } = require('../models');

// 取得所有首頁輪播圖
exports.getAllSlides = async (req, res) => {
  try {
    const slides = await HomeSlide.findAll({
      order: [['order', 'ASC']]
    });
    res.json(slides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 新增首頁輪播圖 (管理介面使用)
exports.createSlide = async (req, res) => {
  try {
    const newSlide = await HomeSlide.create(req.body);
    res.status(201).json(newSlide);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
