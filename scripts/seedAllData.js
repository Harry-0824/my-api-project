require('dotenv').config({ path: __dirname + '/../.env' });
const db = require('../models');

async function seedData() {
  try {
    const { HomeSlide, Article, VehicleModel, VehicleTrim } = db;

    console.log("Connecting database...");
    await db.sequelize.authenticate();
    await db.sequelize.sync({ alter: true });

    // 1. 清理舊資料
    console.log("Cleaning up old data...");
    await HomeSlide.destroy({ where: {}, truncate: true, cascade: true });
    await Article.destroy({ where: {}, truncate: true, cascade: true });
    // SQLite 可能不支援 truncate cascade，但在 MySQL 中可以。注意，外鍵約束可能會導致問題。
    // 如果外鍵限制嚴格，使用 destroy 而不使用 truncate 會更安全。
    // 我們改用 destroy({ where: {} });
    await VehicleTrim.destroy({ where: {} });
    await VehicleModel.destroy({ where: {} });

    // 2. 導入前端資料
    console.log("Loading frontend data via dynamic import...");
    const slidesData = await import('file:///C:/Users/princ/Desktop/MG-motor-main/src/data/home/slides.js');
    const articlesData = await import('file:///C:/Users/princ/Desktop/MG-motor-main/src/data/articles.js');
    const hsSpec = await import('file:///C:/Users/princ/Desktop/MG-motor-main/src/data/hs/vehicleSpec.js');
    const hsDetailed = await import('file:///C:/Users/princ/Desktop/MG-motor-main/src/data/hs/detailedSpecs.js');
    const zsSpec = await import('file:///C:/Users/princ/Desktop/MG-motor-main/src/data/zs/vehicleSpec.js');
    const zsDetailed = await import('file:///C:/Users/princ/Desktop/MG-motor-main/src/data/zs/detailedSpecs.js');

    // 3. 填充輪播圖資料
    console.log("Seeding Slides...");
    const desktopSlides = slidesData.desktopSlides.map((s, idx) => ({ ...s, type: 'desktop', order: idx + 1, subtitle: s.h2, title: s.h1 }));
    const mobileSlides = slidesData.mobileSlides.map((s, idx) => ({ ...s, type: 'mobile', order: idx + 1, subtitle: s.h2, title: s.h1 }));
    await HomeSlide.bulkCreate([...desktopSlides, ...mobileSlides]);

    // 4. 填充文章資料
    console.log("Seeding Articles...");
    const articles = articlesData.allArticles;
    await Article.bulkCreate(articles);

    // 5. 填充車系與車型資料
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
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

seedData();
