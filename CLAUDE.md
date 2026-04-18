# MG Motor API 後端

## 專案概要

MG Motor 品牌展示網站的 RESTful API 後端，提供車款/車型資料、文章內容、首頁輪播圖、會員認證等服務。使用 Express 5 + Sequelize ORM + MySQL。

## 技術棧

- **框架**: Express 5
- **ORM**: Sequelize 6
- **資料庫**: MySQL 8 (mysql2 driver)
- **認證**: JWT (jsonwebtoken) + bcryptjs
- **郵件**: Nodemailer
- **環境變數**: dotenv
- **部署**: Docker (Dockerfile 已配置)

## 目錄結構

```
index.js                # 應用入口（Express 設定、路由掛載、DB 連線）
config/
├── db.js               # 資料庫連線設定
├── sequelize.js         # Sequelize 實例設定
└── vehicleData.js       # 車輛種子資料（HS/ZS）
controllers/
├── articleController.js     # 文章 CRUD
├── authController.js        # 認證（登入/註冊/忘記密碼）
├── homeSlideController.js   # 首頁輪播管理
├── vehicleModelController.js # 車款 CRUD
└── vehicleTrimController.js  # 車型 CRUD
models/
├── index.js             # Sequelize 模型匯出 + 關聯定義
├── Article.js           # 文章模型
├── HomeSlide.js         # 輪播圖模型
├── User.js              # 使用者模型（含密碼加密）
├── VehicleModel.js      # 車款模型
└── VehicleTrim.js       # 車型模型（belongsTo VehicleModel）
routes/
├── articles.js          # /api/articles
├── auth.js              # /api/auth
├── models.js            # /api/models
├── slides.js            # /api/slides
└── trims.js             # /api/trims
middleware/
└── check-auth.js        # JWT 認證中介軟體
scripts/
├── seedAllData.js       # 完整資料種子
├── seedData.js          # 部分資料種子
└── setup-db.js          # 資料庫初始化
database/
├── schema.sql           # 資料庫 Schema
├── seeds.sql            # SQL 種子資料
└── seed-users.js        # 使用者種子
```

## 常用指令

| 指令               | 說明                       |
| ------------------ | -------------------------- |
| `npm start`        | 啟動伺服器 (node index.js) |
| `npm run db:setup` | 初始化資料庫               |
| `npm run db:seed`  | 填充種子資料               |

## 環境變數

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=****
DB_NAME=mg_motor
JWT_SECRET=****
EMAIL_HOST=smtp.example.com
EMAIL_USER=****
EMAIL_PASS=****
```

## API 路由掛載

```javascript
app.use("/api/models", modelsRouter);
app.use("/api/trims", trimsRouter);
app.use("/api/auth", authRouter);
app.use("/api/slides", slidesRouter);
app.use("/api/articles", articlesRouter);
```

## 開發規範

- 所有檔案使用 `.js` 副檔名（CommonJS `require` 語法）
- 資料庫操作一律透過 Sequelize ORM，禁止裸 SQL
- 認證相關端點使用 `check-auth` 中介軟體保護
- 環境變數使用 `dotenv`，禁止硬編碼密鑰
- 所有控制器回應使用統一格式

## 回應格式

```javascript
// 成功
res.json({ success: true, data: result });

// 錯誤
res.status(400).json({ success: false, message: "錯誤訊息" });

// 伺服器錯誤
res.status(500).json({ success: false, message: "伺服器內部錯誤" });
```

## 開發禁忌

- ❌ 禁止在程式碼中硬編碼資料庫密碼、JWT 密鑰等敏感資訊
- ❌ 禁止繞過 Sequelize 使用裸 SQL 查詢
- ❌ 禁止在錯誤回應中洩漏內部資訊（堆疊追蹤、SQL 語句）
- ❌ 禁止跳過 `check-auth` 中介軟體直接開放受保護端點
- ❌ 禁止使用 `sequelize.sync({ force: true })` 在生產環境
