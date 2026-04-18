const { VehicleModel } = require("../models");

// 取得所有車系
exports.getAllModels = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    if (page > 0 && limit > 0) {
      const offset = (page - 1) * limit;
      const { count, rows } = await VehicleModel.findAndCountAll({
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

    const models = await VehicleModel.findAll();
    res.json({ success: true, data: models });
  } catch (err) {
    console.error("取得車系失敗:", err);
    res.status(500).json({ success: false, message: "伺服器內部錯誤" });
  }
};

// 根據 ID 取得單一車系
exports.getModelById = async (req, res) => {
  try {
    const model = await VehicleModel.findByPk(req.params.id);
    if (!model) {
      return res.status(404).json({ success: false, message: "找不到該車系" });
    }
    res.json({ success: true, data: model });
  } catch (err) {
    console.error("取得車系失敗:", err);
    res.status(500).json({ success: false, message: "伺服器內部錯誤" });
  }
};

// 新增車系
exports.createModel = async (req, res) => {
  const { name, slug } = req.body;
  try {
    const newModel = await VehicleModel.create({ name, slug });
    res.status(201).json({ success: true, data: newModel });
  } catch (err) {
    console.error("新增車系失敗:", err);
    res.status(500).json({ success: false, message: "伺服器內部錯誤" });
  }
};

// 更新車系
exports.updateModel = async (req, res) => {
  const { name, slug } = req.body;
  try {
    const [updated] = await VehicleModel.update(
      { name, slug },
      {
        where: { id: req.params.id },
      },
    );
    if (updated === 0) {
      return res.status(404).json({ success: false, message: "找不到該車系" });
    }
    const updatedModel = await VehicleModel.findByPk(req.params.id);
    res.json({ success: true, data: updatedModel });
  } catch (err) {
    console.error("更新車系失敗:", err);
    res.status(500).json({ success: false, message: "伺服器內部錯誤" });
  }
};

// 刪除車系
exports.deleteModel = async (req, res) => {
  try {
    const deleted = await VehicleModel.destroy({
      where: { id: req.params.id },
    });
    if (deleted === 0) {
      return res.status(404).json({ success: false, message: "找不到該車系" });
    }
    res.json({ success: true, message: "刪除成功" });
  } catch (err) {
    console.error("刪除車系失敗:", err);
    res.status(500).json({ success: false, message: "伺服器內部錯誤" });
  }
};
