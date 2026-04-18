const { VehicleTrim, VehicleModel } = require("../models");

// 取得所有車型
exports.getAllTrims = async (req, res) => {
  try {
    const { model_slug } = req.query;
    const where = {};
    const include = [];

    if (model_slug) {
      include.push({
        model: VehicleModel,
        as: "model",
        where: { slug: model_slug },
        required: true,
      });
    }

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    if (page > 0 && limit > 0) {
      const offset = (page - 1) * limit;
      const { count, rows } = await VehicleTrim.findAndCountAll({
        where,
        include,
        offset,
        limit,
      });
      const formattedTrims = rows.map((trim) => {
        const data = trim.get({ plain: true });
        data.colors = data.colors_json;
        data.equipment = data.equipment_json;
        data.specImages = data.spec_images_json;
        data.basicSpecs = data.basic_specs_json;
        data.detailedSpecs = data.detailed_specs_json;
        return data;
      });
      return res.json({
        success: true,
        data: formattedTrims,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      });
    }

    const trims = await VehicleTrim.findAll({
      where,
      include,
    });

    // 格式化資料以契合前端欄位預期
    const formattedTrims = trims.map((trim) => {
      const data = trim.get({ plain: true });
      data.colors = data.colors_json;
      data.equipment = data.equipment_json;
      data.specImages = data.spec_images_json;
      data.basicSpecs = data.basic_specs_json;
      data.detailedSpecs = data.detailed_specs_json;
      return data;
    });

    res.json({ success: true, data: formattedTrims });
  } catch (err) {
    console.error("取得車型失敗:", err);
    res.status(500).json({ success: false, message: "伺服器內部錯誤" });
  }
};

// 根據 ID 取得單一車型
exports.getTrimById = async (req, res) => {
  try {
    const trim = await VehicleTrim.findByPk(req.params.id);
    if (!trim) {
      return res.status(404).json({ success: false, message: "找不到該車型" });
    }
    res.json({ success: true, data: trim });
  } catch (err) {
    console.error("取得車型失敗:", err);
    res.status(500).json({ success: false, message: "伺服器內部錯誤" });
  }
};

// 新增車型
exports.createTrim = async (req, res) => {
  try {
    const newTrim = await VehicleTrim.create(req.body);
    res.status(201).json({ success: true, data: newTrim });
  } catch (err) {
    console.error("新增車型失敗:", err);
    res.status(500).json({ success: false, message: "伺服器內部錯誤" });
  }
};

// 更新車型
exports.updateTrim = async (req, res) => {
  try {
    const [updated] = await VehicleTrim.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated === 0) {
      return res.status(404).json({ success: false, message: "找不到該車型" });
    }
    const updatedTrim = await VehicleTrim.findByPk(req.params.id);
    res.json({ success: true, data: updatedTrim });
  } catch (err) {
    console.error("更新車型失敗:", err);
    res.status(500).json({ success: false, message: "伺服器內部錯誤" });
  }
};

// 刪除車型
exports.deleteTrim = async (req, res) => {
  try {
    const deleted = await VehicleTrim.destroy({
      where: { id: req.params.id },
    });
    if (deleted === 0) {
      return res.status(404).json({ success: false, message: "找不到該車型" });
    }
    res.json({ success: true, message: "刪除成功" });
  } catch (err) {
    console.error("刪除車型失敗:", err);
    res.status(500).json({ success: false, message: "伺服器內部錯誤" });
  }
};
