const { VehicleModel } = require('../models');

// 取得所有車系
exports.getAllModels = async (req, res) => {
  try {
    const models = await VehicleModel.findAll();
    res.json(models);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 根據 ID 取得單一車系
exports.getModelById = async (req, res) => {
  try {
    const model = await VehicleModel.findByPk(req.params.id);
    if (!model) {
      return res.status(404).json({ message: "Model not found (找不到該車系)" });
    }
    res.json(model);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 新增車系
exports.createModel = async (req, res) => {
  const { name, slug } = req.body;
  try {
    const newModel = await VehicleModel.create({ name, slug });
    res.status(201).json(newModel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 更新車系
exports.updateModel = async (req, res) => {
  const { name, slug } = req.body;
  try {
    const [updated] = await VehicleModel.update({ name, slug }, {
      where: { id: req.params.id }
    });
    if (updated === 0) {
      return res.status(404).json({ message: "Model not found (找不到該車系)" });
    }
    const updatedModel = await VehicleModel.findByPk(req.params.id);
    res.json(updatedModel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 刪除車系
exports.deleteModel = async (req, res) => {
  try {
    const deleted = await VehicleModel.destroy({
      where: { id: req.params.id }
    });
    if (deleted === 0) {
      return res.status(404).json({ message: "Model not found (找不到該車系)" });
    }
    res.json({ message: "Model deleted successfully (刪除成功)" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
