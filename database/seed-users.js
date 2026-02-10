const { User, sequelize } = require('../models');
const bcrypt = require('bcryptjs');

async function seedUsers() {
  try {
    // 確保資料庫連線
    await sequelize.authenticate();
    console.log('資料庫連線成功');

    // 同步資料表
    await sequelize.sync({ alter: true });
    console.log('資料表同步完成，開始插入假資料...');

    // 加密密碼
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 假資料列表
    const users = [
      {
        username: 'harry_chen',
        email: 'harry@example.com',
        password: hashedPassword,
      },
      {
        username: 'test_user',
        email: 'test@example.com',
        password: hashedPassword,
      },
      {
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
      }
    ];

    // 逐一檢查並插入
    for (const userData of users) {
      const [user, created] = await User.findOrCreate({
        where: { email: userData.email },
        defaults: userData
      });

      if (created) {
        console.log(`使用者 ${user.username} 建立成功`);
      } else {
        console.log(`使用者 ${user.username} 已存在，跳過`);
      }
    }

    console.log('假資料插入完成');
    process.exit(0);
  } catch (error) {
    console.error('插入假資料失敗:', error);
    process.exit(1);
  }
}

seedUsers();
