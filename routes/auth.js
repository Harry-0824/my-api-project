const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const checkAuth = require("../middleware/check-auth");

// 註冊
router.post("/register", authController.register);

// 登入
router.post("/login", authController.login);

// 忘記密碼
router.post("/forgot-password", authController.forgotPassword);

// 重置密碼 (注意路徑中的 :token)
router.post("/reset-password/:token", authController.resetPassword);

// 會員專區 (Protected Route)
router.get("/profile", checkAuth, authController.getProfile);

module.exports = router;
