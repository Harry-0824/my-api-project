const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
  // 註冊註冊
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // 檢查是否已存在
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: '該電子郵件已有人使用' });
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
        message: '註冊成功',
        userId: user.id
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: '伺服器錯誤', error: error.message });
    }
  },

  // 登入
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // 尋找使用者
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: '電子郵件或密碼錯誤' });
      }

      // 驗證密碼
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: '電子郵件或密碼錯誤' });
      }

      // 簽發 JWT
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );

      res.status(200).json({
        message: '登入成功',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: '伺服器錯誤', error: error.message });
    }
  }
};

module.exports = authController;
