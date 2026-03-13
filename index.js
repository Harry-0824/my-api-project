require("dotenv").config(); // 載入環境變數
const express = require("express");
const cors = require("cors");
const app = express();

// 啟用 CORS
app.use(cors());
const port = process.env.PORT || 3000;
const db = require("./models");

// 檢查資料庫連線
db.sequelize
  .authenticate()
  .then(() => {
    console.log("資料庫連線成功 (Sequelize)");
    // 自動同步資料表結構 (研發環境使用)
    db.sequelize.sync({ alter: true }).then(() => {
      console.log("資料表同步完成");
    });
  })
  .catch((err) => {
    console.error("資料庫連線失敗:", err);
  });

// 引入路由
const modelsRouter = require("./routes/models");
const trimsRouter = require("./routes/trims");
const authRouter = require("./routes/auth");
const slidesRouter = require("./routes/slides");
const articlesRouter = require("./routes/articles");

// 中介軟體
app.use(express.json());

// 掛載路由
app.use("/api/models", modelsRouter);
app.use("/api/trims", trimsRouter);
app.use("/api/auth", authRouter);
app.use("/api/slides", slidesRouter);
app.use("/api/articles", articlesRouter);

// 測試用路由
app.get("/api/seed", async (req, res) => {
  try {
    const { HomeSlide, Article, VehicleModel, VehicleTrim } = db;
    
    // 1. 清理舊資料 (不使用 truncate 避免 MySQL 外鍵衝突)
    await HomeSlide.destroy({ where: {} });
    await Article.destroy({ where: {} });
    await VehicleTrim.destroy({ where: {} });
    await VehicleModel.destroy({ where: {} });

    // 2. 填充輪播圖資料
    const desktopSlides = [
      { image: "/media/banner/MG HS 限定版首頁Banner - PC 1920x960.webp", title: "MG HS 馭風前行版", subtitle: "限量登場", type: "desktop", order: 1, label: "MG HS", buttonText: "瞭解更多" },
      { image: "/media/banner/官網HERO-Banner_1920x960.webp", title: "挑戰不可能！", subtitle: "和謝淑薇一起", type: "desktop", order: 2, label: "MG ZS", buttonText: "瞭解更多" },
      { image: "/media/banner/首頁_KV_PC_HS介紹.webp", title: "有本事 讓世界心跳加速", subtitle: "MG HS", type: "desktop", order: 3, label: "MG HS", buttonText: "查看車款規格" },
      { image: "/media/banner/MG-ZS官網Resize_0904_官網首頁_ZS車圖1920x960_PC.webp", title: "有本事 讓世界心跳加速", subtitle: "MG ZS", type: "desktop", order: 4, label: "MG ZS", buttonText: "查看車款規格" }
    ];
    await HomeSlide.bulkCreate(desktopSlides);

    // 3. 填充文章資料
    const articles = [
      { id: "news-1", title: "MG史上最強購車方案七月續航！", category: "最新購車優惠", date: "2025-07-01", heroImage: "/media/explore/tag/0701news.thumb.960.480.webp", content: [{type:"paragraph", text: "..."}], tags: [] },
      { id: "news-2", title: "2025年最新銷售資訊公告", category: "最新活動訊息", date: "2025/04/18", heroImage: "/media/banner/MG-ZS官網Resize_0904_官網首頁_ZS車圖1920x960_PC.webp", content: [{type:"paragraph", text: "..."}], tags: [] }
    ];
    await Article.bulkCreate(articles);

    // 4. 填充車系與車型資料
    const hs = await VehicleModel.create({ name: 'MG HS', slug: 'hs' });
    const zs = await VehicleModel.create({ name: 'MG ZS', slug: 'zs' });
    
    await VehicleTrim.create({
      model_id: hs.id,
      name: "HS 1.5T 旗艦版",
      price_display: "939,000",
      main_image: "/media/hs/MG官網_共用圖_690x494_EHS灰.webp",
      booking_link: "https://www.mgmotor.com.tw/testdrive.html",
      online_order_link: "https://www.mgmotor.com.tw/order.html",
      disclaimer: "免責聲明: 此車輛尺寸為標準尺寸, 實際尺寸以交車為準",
      basic_specs_json: [
        { label: "長*寬*高(mm)", value: "4,610*1,876*1,685" },
        { label: "軸距(mm)", value: "2,720" },
        { label: "引擎型式", value: "MEGA Tech 1.5T缸內直噴渦輪增壓引擎" }
      ],
      detailed_specs_json: {
        "基本規格": [
          { label: "全長x全寬x全高 (mm)", value: "4,610x1,876x1,685" },
          { label: "軸距 (mm)", value: "2720" }
        ],
        "動力系統": [
          { label: "引擎型式", value: "MEGA Tech 1.5T缸內直噴渦輪增壓汽油引擎" }
        ]
      }
    });

    await VehicleTrim.create({
      model_id: zs.id,
      name: "ZS 1.5L 旗艦版",
      price_display: "749,000",
      main_image: "/media/zs/MG-ZS-白.webp",
      booking_link: "https://www.mgmotor.com.tw/testdrive.html",
      online_order_link: "https://www.mgmotor.com.tw/order.html",
      disclaimer: "免責聲明: 此車輛尺寸為標準尺寸, 實際尺寸以交車為準",
      basic_specs_json: [
        { label: "長*寬*高(mm)", value: "4,323*1,809*1,653" },
        { label: "軸距(mm)", value: "2,585" }
      ],
      detailed_specs_json: {
        "基本規格": [
          { label: "全長x全寬x全高 (mm)", value: "4,323x1,809x1,653" },
          { label: "軸距 (mm)", value: "2585" }
        ]
      }
    });

    res.json({ message: "MG Database seeded successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/hello", (req, res) => {
  const name = req.query.name || "World";
  res.status(200).json({
    message: "GET 請求成功！",
    data: `Hello, ${name}!`,
  });
});

app.listen(port, () => {
  console.log(`伺服器已啟動，正在監聽 http://localhost:${port}`);
});
