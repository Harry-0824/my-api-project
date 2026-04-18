const express = require("express");
const router = express.Router();
const vehicleTrimController = require("../controllers/vehicleTrimController");
const checkAuth = require("../middleware/check-auth");
const {
  validateCreateTrim,
  validateUpdateTrim,
  handleValidationErrors,
} = require("../middleware/validators");

// GET /api/trims - 取得所有車型
router.get("/", vehicleTrimController.getAllTrims);

// GET /api/trims/:id - 取得單一車型
router.get("/:id", vehicleTrimController.getTrimById);

// POST /api/trims - 新增車型
router.post(
  "/",
  checkAuth,
  validateCreateTrim,
  handleValidationErrors,
  vehicleTrimController.createTrim,
);

// PUT /api/trims/:id - 更新車型
router.put(
  "/:id",
  checkAuth,
  validateUpdateTrim,
  handleValidationErrors,
  vehicleTrimController.updateTrim,
);

// DELETE /api/trims/:id - 刪除車型
router.delete("/:id", checkAuth, vehicleTrimController.deleteTrim);

module.exports = router;
