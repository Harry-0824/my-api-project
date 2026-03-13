require('dotenv').config({ path: __dirname + '/../.env' });
const db = require('../models');
const { hsData, zsData } = require('../config/vehicleData');

async function seedData() {
  const { sequelize, HomeSlide, Article, VehicleModel, VehicleTrim } = db;

  try {
    console.log('Connecting database...');
    await sequelize.authenticate();
    
    // 1. 暫時關閉外鍵檢查
    console.log('Disabling foreign key checks...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // 2. 同步資料表結構
    await sequelize.sync({ alter: true });

    // 3. 清理舊資料
    console.log('Cleaning up old data...');
    await HomeSlide.destroy({ where: {} });
    await Article.destroy({ where: {} });
    await VehicleTrim.destroy({ where: {} });
    await VehicleModel.destroy({ where: {} });

    // 重新開啟外鍵檢查
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Loading data...');

    // 5. 填充輪播圖資料
    console.log('Seeding Slides...');
    const desktopSlides = [
      { image: '/media/banner/MG HS 限定版首頁Banner - PC 1920x960.webp', title: 'MG HS 馭風前行版', subtitle: '限量登場', type: 'desktop', order: 1, label: 'MG HS', buttonText: '瞭解更多' },
      { image: '/media/banner/官網HERO-Banner_1920x960.webp', title: '挑戰不可能！', subtitle: '和謝淑薇一起', type: 'desktop', order: 2, label: 'MG ZS', buttonText: '瞭解更多' },
      { image: '/media/banner/首頁_KV_PC_HS介紹.webp', title: '有本事 讓世界心跳加速', subtitle: 'MG HS', type: 'desktop', order: 3, label: 'MG HS', buttonText: '查看車款規格' },
      { image: '/media/banner/MG-ZS官網Resize_0904_官網首頁_ZS車圖1920x960_PC.webp', title: '有本事 讓世界心跳加速', subtitle: 'MG ZS', type: 'desktop', order: 4, label: 'MG ZS', buttonText: '查看車款規格' }
    ];
    await HomeSlide.bulkCreate(desktopSlides);

    // 6. 填充文章資料
    console.log('Seeding Articles...');
    const articles = [
      { id: 'news-1', title: 'MG史上最強購車方案七月續航！', category: '最新購車優惠', date: '2025-07-01', heroImage: '/media/explore/tag/0701news.thumb.960.480.webp', content: [{'type':'paragraph', 'text': '...'}], tags: [] },
      { id: 'news-2', title: '2025年最新銷售資訊公告', category: '最新活動訊息', date: '2025/04/18', heroImage: '/media/banner/MG-ZS官網Resize_0904_官網首頁_ZS車圖1920x960_PC.webp', content: [{'type':'paragraph', 'text': '...'}], tags: [] }
    ];
    await Article.bulkCreate(articles);

    // 7. 填充車系與車型資料
    console.log('Seeding Models & Trims...');
    
    // HS
    const hs = await VehicleModel.create({ name: 'MG HS', slug: 'hs' });
    await VehicleTrim.create({
      model_id: hs.id,
      ...hsData
    });

    // ZS
    const zs = await VehicleModel.create({ name: 'MG ZS', slug: 'zs' });
    await VehicleTrim.create({
      model_id: zs.id,
      ...zsData
    });

    console.log('Data migration to MySQL completed successfully.');
    process.exit(0);
  } catch (error) {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

seedData();
