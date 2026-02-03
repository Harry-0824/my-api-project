const { VehicleTrim } = require('../models');

// 取得所有車型
exports.getAllTrims = async (req, res) => {
  try {
    const trims = await VehicleTrim.findAll();
    res.json(trims);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 根據 ID 取得單一車型
exports.getTrimById = async (req, res) => {
  try {
    const trim = await VehicleTrim.findByPk(req.params.id);
    if (!trim) {
      return res.status(404).json({ message: "Trim not found (找不到該車型)" });
    }
    res.json(trim);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 新增車型
exports.createTrim = async (req, res) => {
  try {
    const newTrim = await VehicleTrim.create(req.body);
    res.status(201).json(newTrim);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 更新車型
exports.updateTrim = async (req, res) => {
  try {
    const [updated] = await VehicleTrim.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated === 0) {
      return res.status(404).json({ message: "Trim not found (找不到該車型)" });
    }
    const updatedTrim = await VehicleTrim.findByPk(req.params.id);
    res.json(updatedTrim);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 刪除車型
exports.deleteTrim = async (req, res) => {
  try {
    const deleted = await VehicleTrim.destroy({
      where: { id: req.params.id }
    });
    if (deleted === 0) {
      return res.status(404).json({ message: "Trim not found (找不到該車型)" });
    }
    res.json({ message: "Trim deleted successfully (刪除成功)" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
