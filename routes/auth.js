const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const checkAuth = require("../middleware/check-auth");
const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  handleValidationErrors,
} = require("../middleware/validators");

// 註冊
router.post(
  "/register",
  validateRegister,
  handleValidationErrors,
  authController.register,
);

// 登入
router.post(
  "/login",
  validateLogin,
  handleValidationErrors,
  authController.login,
);

// 忘記密碼
router.post(
  "/forgot-password",
  validateForgotPassword,
  handleValidationErrors,
  authController.forgotPassword,
);

// 重置密碼
router.post(
  "/reset-password/:token",
  validateResetPassword,
  handleValidationErrors,
  authController.resetPassword,
);

// 會員專區 (Protected Route)
router.get("/profile", checkAuth, authController.getProfile);

module.exports = router;
