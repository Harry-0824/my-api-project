const express = require("express");
const router = express.Router();
const vehicleModelController = require("../controllers/vehicleModelController");

// 各個路由將請求轉發給對應的 Controller 處理

// GET /api/models - 取得所有車系
router.get("/", vehicleModelController.getAllModels);

// GET /api/models/:id - 取得單一車系
router.get("/:id", vehicleModelController.getModelById);

// POST /api/models - 新增車系
router.post("/", vehicleModelController.createModel);

// PUT /api/models/:id - 更新車系
router.put("/:id", vehicleModelController.updateModel);

// DELETE /api/models/:id - 刪除車系
router.delete("/:id", vehicleModelController.deleteModel);

module.exports = router;
