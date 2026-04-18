const express = require("express");
const router = express.Router();
const vehicleModelController = require("../controllers/vehicleModelController");
const checkAuth = require("../middleware/check-auth");
const {
  validateCreateModel,
  validateUpdateModel,
  handleValidationErrors,
} = require("../middleware/validators");

// GET /api/models - 取得所有車系
router.get("/", vehicleModelController.getAllModels);

// GET /api/models/:id - 取得單一車系
router.get("/:id", vehicleModelController.getModelById);

// POST /api/models - 新增車系
router.post(
  "/",
  checkAuth,
  validateCreateModel,
  handleValidationErrors,
  vehicleModelController.createModel,
);

// PUT /api/models/:id - 更新車系
router.put(
  "/:id",
  checkAuth,
  validateUpdateModel,
  handleValidationErrors,
  vehicleModelController.updateModel,
);

// DELETE /api/models/:id - 刪除車系
router.delete("/:id", checkAuth, vehicleModelController.deleteModel);

module.exports = router;
