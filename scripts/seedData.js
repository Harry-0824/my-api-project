const { HomeSlide, Article, sequelize } = require('../models');

const desktopSlides = [
  {
    image: "/media/banner/MG HS 限定版首頁Banner - PC 1920x960.webp",
    link: "https://www.mgmotor.com.tw/configuration/hs.html",
    title: "MG HS 馭風前行版",
    subtitle: "限量登場",
    type: "desktop",
    order: 1
  },
  {
    image: "/media/banner/官網HERO-Banner_1920x960.webp",
    link: "https://www.mgmotor.com.tw/configuration/zs.html",
    title: "挑戰不可能！",
    subtitle: "和謝淑薇一起",
    type: "desktop",
    order: 2
  },
  {
    image: "/media/banner/首頁_KV_PC_HS介紹.webp",
    link: "https://www.mgmotor.com.tw/configuration/zs.html",
    title: "有本事 讓世界心跳加速",
    subtitle: "MG HS",
    type: "desktop",
    order: 3
  },
  {
    image: "/media/banner/MG-ZS官網Resize_0904_官網首頁_ZS車圖1920x960_PC.webp",
    link: "https://www.mgmotor.com.tw/configuration/zs.html",
    title: "有本事 讓世界心跳加速",
    subtitle: "MG ZS",
    type: "desktop",
    order: 4
  }
];

const mobileSlides = [
  {
    image: "/media/banner/首頁_KV_Mob_HS 介紹.webp",
    link: "https://www.mgmotor.com.tw/configuration/hs.html",
    title: "有本事 讓世界心跳加速",
    subtitle: "MG HS",
    type: "mobile",
    order: 1
  },
  {
    image: "/media/banner/官網首頁_750_1120_mo.webp",
    link: "https://www.mgmotor.com.tw/configuration/hs.html",
    title: "MG ZS",
    subtitle: "同級唯一滿配",
    type: "mobile",
    order: 2
  },
  {
    image: "/media/banner/官網HERO-Banner_750x1120.webp",
    link: "https://www.mgmotor.com.tw/configuration/hs.html",
    title: "挑戰不可能！",
    subtitle: "和謝淑薇一起",
    type: "mobile",
    order: 3
  },
  {
    image: "/media/banner/MG-ZS官網Resize_0904_官網首頁_ZS車圖750X1120_MB (1).webp",
    link: "https://www.mgmotor.com.tw/configuration/zs.html",
    title: "天生出眾",
    subtitle: "MG ZS",
    type: "mobile",
    order: 4
  }
];

const articles = [
  {
    id: "news-1",
    title: "MG史上最強購車方案七月續航！HS、ZS享超值入主價86.5萬／69.9萬起",
    desc: "HS 2.0T & PHEV加碼送一年乙式車體險，保固內免費定保，堪稱業界最強售服保障！",
    category: "最新購車優惠",
    date: "2025-07-01",
    tags: ["焦點推薦", "#行銷活動"],
    heroImage: "/media/explore/tag/0701news.thumb.960.480.webp",
    content: [
      { type: "heading", level: 2, text: "HS 2.0T & PHEV加碼送一年乙式車體險、保固內免費定期保養，給予最強售服承諾！" },
      { type: "image", src: "/media/explore/news/01.webp", alt: "MG HS 情境圖" },
      { type: "paragraph", text: "MG Taiwan六月火力全開，祭出史上最強購車優惠方案..." }
    ]
  },
  {
    id: "news-2",
    title: "2025年「HS 2.0T旗艦版、HS PHEV馭電版」最新銷售資訊公告",
    category: "最新活動訊息",
    date: "2025/04/18",
    tags: ["#News"],
    heroImage: "/media/banner/MG-ZS官網Resize_0904_官網首頁_ZS車圖1920x960_PC.webp",
    content: [{ type: "paragraph", text: "詳細內容建構中..." }]
  },
  {
    id: "offer-1",
    title: "MG HS / HS PHEV 購車優惠",
    desc: "HS全車系本月限定86.5萬元起",
    category: "最新購車優惠",
    date: "2025/07/01",
    tags: ["焦點推薦", "#MG 新車資訊", "#MG 優惠資訊"],
    heroImage: "/media/explore/tag/0701news.thumb.960.480.webp",
    content: [
      { type: "heading", level: 2, text: "HS 2.0T & PHEV加碼送一年乙式車體險、保固內免費定期保養，給予最強售服承諾！" },
      { type: "paragraph", text: "台灣英倫摩里斯(MG Taiwan)為感謝廣大消費者支持..." }
    ]
  }
];

async function seed() {
  try {
    // 暫時關閉外鍵檢查
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    await sequelize.sync();
    console.log("Database synced");

    // Seed Slides
    await HomeSlide.destroy({ where: {}, truncate: true });
    // ... 你的 desktopSlides / mobileSlides 陣列 ...
    await HomeSlide.bulkCreate([...desktopSlides, ...mobileSlides]);
    console.log("Slides seeded");

    // Seed Articles
    await Article.destroy({ where: {}, truncate: true });
    // ... 你的 articles 陣列 ...
    await Article.bulkCreate(articles);
    console.log("Articles seeded");

    // 重新開啟外鍵檢查
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    process.exit(0);
  } catch (err) {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();