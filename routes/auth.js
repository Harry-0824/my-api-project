const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 註冊
router.post('/register', authController.register);

// 登入
router.post('/login', authController.login);

module.exports = router;
