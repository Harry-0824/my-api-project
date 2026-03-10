require('dotenv').config({ path: __dirname + '/../.env' });
const db = require('../models');

async function seedData() {
  const { sequelize, HomeSlide, Article, VehicleModel, VehicleTrim } = db;

  try {
    console.log("Connecting database...");
    await sequelize.authenticate();
    
    // 1. 暫時關閉外鍵檢查，以便清理舊資料
    console.log("Disabling foreign key checks...");
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // 2. 同步資料表結構
    await sequelize.sync({ alter: true });

    // 3. 清理舊資料 (現在不會因為外鍵報錯了)
    console.log("Cleaning up old data...");
    await HomeSlide.destroy({ where: {}, truncate: true });
    await Article.destroy({ where: {}, truncate: true });
    await VehicleTrim.destroy({ where: {}, truncate: true });
    await VehicleModel.destroy({ where: {}, truncate: true });

    // 重新開啟外鍵檢查
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    // 4. 導入前端資料 (請確保這些路徑在 GCP 伺服器上有效，或改用相對路徑)
    console.log("Loading data...");
    // 註：在雲端環境建議直接將資料定義在腳本內，或確認檔案路徑正確
    const slidesData = await import('../src/data/home/slides.js'); 
    const articlesData = await import('../src/data/articles.js');
    const hsSpec = await import('../src/data/hs/vehicleSpec.js');
    const hsDetailed = await import('../src/data/hs/detailedSpecs.js');
    const zsSpec = await import('../src/data/zs/vehicleSpec.js');
    const zsDetailed = await import('../src/data/zs/detailedSpecs.js');

    // 5. 填充輪播圖資料
    console.log("Seeding Slides...");
    const desktopSlides = slidesData.desktopSlides.map((s, idx) => ({ ...s, type: 'desktop', order: idx + 1, subtitle: s.h2, title: s.h1 }));
    const mobileSlides = slidesData.mobileSlides.map((s, idx) => ({ ...s, type: 'mobile', order: idx + 1, subtitle: s.h2, title: s.h1 }));
    await HomeSlide.bulkCreate([...desktopSlides, ...mobileSlides]);

    // 6. 填充文章資料
    console.log("Seeding Articles...");
    await Article.bulkCreate(articlesData.allArticles);

    // 7. 填充車系與車型資料
    console.log("Seeding Models & Trims...");
    const hs = await VehicleModel.create({ name: hsSpec.hsSpecData.modelName, slug: 'hs' });
    for (const trim of hsSpec.hsSpecData.trims) {
      await VehicleTrim.create({
        model_id: hs.id,
        name: trim.name,
        price_display: trim.price,
        main_image: trim.specImages.main.src,
        booking_link: trim.bookingLink,
        online_order_link: trim.onlineOrderLink,
        disclaimer: trim.disclaimer,
        basic_specs_json: trim.basicSpecs,
        detailed_specs_json: hsDetailed.hsDetailedSpecs[trim.name] || {}
      });
    }

    const zs = await VehicleModel.create({ name: zsSpec.zsSpecData.modelName, slug: 'zs' });
    for (const trim of zsSpec.zsSpecData.trims) {
      await VehicleTrim.create({
        model_id: zs.id,
        name: trim.name,
        price_display: trim.price,
        main_image: trim.specImages.main.src,
        booking_link: trim.bookingLink,
        online_order_link: trim.onlineOrderLink,
        disclaimer: trim.disclaimer,
        basic_specs_json: trim.basicSpecs,
        detailed_specs_json: zsDetailed.zsDetailedSpecs[trim.name] || {}
      });
    }

    console.log("Data migration to MySQL completed successfully.");
    process.exit(0);
  } catch (error) {
    // 發生錯誤時也試著把檢查開回來，避免影響後續操作
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

seedData();