const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");

const authController = {
  // 註冊註冊
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // 檢查是否已存在
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "該電子郵件已有人使用" });
      }

      // 密碼加密
      const hashedPassword = await bcrypt.hash(password, 10);

      // 建立新使用者
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      res.status(201).json({
        message: "註冊成功",
        userId: user.id,
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ message: "伺服器錯誤", error: error.message });
    }
  },

  // 登入
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // 尋找使用者
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: "電子郵件或密碼錯誤" });
      }

      // 驗證密碼
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "電子郵件或密碼錯誤" });
      }

      // 簽發 JWT
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "24h" },
      );

      res.status(200).json({
        message: "登入成功",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "伺服器錯誤", error: error.message });
    }
  },

  // 忘記密碼 - 發送重置信件
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: "找不到該電子郵件的使用者" });
      }

      // 生成隨機 Token
      const token = crypto.randomBytes(20).toString("hex");

      // 設定 Token 及過期時間 (1小時後)
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 小時
      await user.save();

      // 設定 Nodemailer Transporter
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const resetUrl = `http://localhost:3000/reset-password/${token}`;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "密碼重置請求",
        text:
          `您收到此信是因為您 (或其他人) 申請了重置帳戶密碼。\n\n` +
          `請點擊以下連結完成重置 (一小時內有效)：\n\n` +
          `${resetUrl}\n\n` +
          `如果您沒有申請，請忽略此信，您的密碼將不會改變。\n`,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: "重置信件已發送至您的信箱" });
    } catch (error) {
      console.error("Forgot Password error:", error);
      res.status(500).json({ message: "發送郵件失敗", error: error.message });
    }
  },

  // 重置密碼 - 驗證 Token 並更新密碼
  resetPassword: async (req, res) => {
    try {
      const { token } = req.params; // 從 URL 參數取得 token
      const { password } = req.body;

      // 尋找持有該 Token 且尚未過期的使用者
      const user = await User.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: { [Op.gt]: Date.now() }, // resetPasswordExpires > 現在時間
        },
      });

      if (!user) {
        return res.status(400).json({ message: "密碼重置連結無效或已過期" });
      }

      // 加密新密碼
      const hashedPassword = await bcrypt.hash(password, 10);

      // 更新使用者資料
      user.password = hashedPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      res.status(200).json({ message: "密碼已成功重置" });
    } catch (error) {
      console.error("Reset Password error:", error);
      res.status(500).json({ message: "重置密碼失敗", error: error.message });
    }
  },

  // 取得會員資料 (需驗證)
  getProfile: async (req, res) => {
    try {
      // req.userData 來自 check-auth middleware
      const user = await User.findByPk(req.userData.userId, {
        attributes: {
          exclude: ["password", "resetPasswordToken", "resetPasswordExpires"],
        }, // 排除敏感資訊
      });

      if (!user) {
        return res.status(404).json({ message: "找不到使用者" });
      }

      res.status(200).json({
        message: "取得會員資料成功",
        user,
      });
    } catch (error) {
      console.error("Get Profile error:", error);
      res.status(500).json({ message: "伺服器錯誤", error: error.message });
    }
  },
};

module.exports = authController;
