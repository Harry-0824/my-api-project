const express = require("express");
const router = express.Router();
const vehicleTrimController = require("../controllers/vehicleTrimController");

// 各個路由將請求轉發給對應的 Controller 處理

// GET /api/trims - 取得所有車型
router.get("/", vehicleTrimController.getAllTrims);

// GET /api/trims/:id - 取得單一車型
router.get("/:id", vehicleTrimController.getTrimById);

// POST /api/trims - 新增車型
router.post("/", vehicleTrimController.createTrim);

// PUT /api/trims/:id - 更新車型
router.put("/:id", vehicleTrimController.updateTrim);

// DELETE /api/trims/:id - 刪除車型
router.delete("/:id", vehicleTrimController.deleteTrim);

module.exports = router;
