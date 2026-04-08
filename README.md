# MG 汽車 API 專案 (My API Project)

這是一個為 MG 汽車網站設計的後端 API 專案，基於 Node.js、Express 和 Sequelize (ORM) 建構。支援使用者認證、首頁輪播圖、最新消息 (文章) 以及車系與車型的資料管理。

## 🚀 核心功能

- **使用者認證 (Auth)**: 支援註冊、登入、JWT 驗證、忘記密碼與重置密碼功能。
- **車系與車型管理 (Models & Trims)**: 提供完整的 CRUD 介面，並支援車系與車型之間的關聯查詢。
- **首頁輪播圖 (Slides)**: 儲存與管理電腦版 (Desktop) 及手機版 (Mobile) 的輪播圖資訊。
- **文章/新聞管理 (Articles)**: 管理最新消息、優惠活動等文章內容。
- **資料庫同步與初始化**: 支援 Sequelize 模型自動同步，並提供強大的資料填充 (Seeding) 功能。

## 🛠️ 技術棧

- **核心**: Node.js, Express (v5.2.1)
- **資料庫 ORM**: [Sequelize](https://sequelize.org/)
- **資料庫**: PostgreSQL — 託管於 [Supabase](https://supabase.com/)（pg 驅動）
- **認證管理**: [jsonwebtoken (JWT)](https://jwt.io/), [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **郵件服務**: [Nodemailer](https://nodemailer.com/) (用於密碼重置)
- **跨域處理**: [CORS](https://github.com/expressjs/cors)

## 📦 安裝與設定

### 1. 安裝套件

而在專案根目錄執行：

```bash
npm install
```

### 2. 環境變數設定 (.env)

請建立 `.env` 檔案並設定以下變數：

```env
PORT=3000
NODE_ENV=development

# Supabase 直連（本地開發用）
DB_HOST=db.<project-ref>.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=你的Supabase資料庫密碼
DB_NAME=postgres

JWT_SECRET=請使用高熵隨機字串
EMAIL_USER=你的信箱
EMAIL_PASS=你的應用程式碼
```

> **生產環境 (Cloud Run)**：`DB_HOST` 改為 Supabase Transaction Pooler 主機，`DB_PORT` 改為 `6543`，`DB_USER` 格式為 `postgres.<project-ref>`。

### 3. 填充初始資料

Supabase 資料庫建立後，直接執行 seed 腳本填入初始資料：

```bash
npm run db:seed
```

或透過 API 端點：

```
GET http://localhost:3000/api/seed
```

> `db:setup` 腳本（建立 MySQL 資料庫用）已不適用，Supabase 資料庫由 Supabase Dashboard 管理。

## 📖 完整 API 端點列表

### 使用者認證 (`/api/auth`)

| 方法 | 路徑                     | 說明                    |
| :--- | :----------------------- | :---------------------- |
| POST | `/register`              | 註冊新帳號              |
| POST | `/login`                 | 登入並取得 Token        |
| POST | `/forgot-password`       | 發送密碼重置信件        |
| POST | `/reset-password/:token` | 執行密碼重置            |
| GET  | `/profile`               | 取得個人資料 (需 Token) |

### 車系管理 (`/api/models`)

| 方法   | 路徑   | 說明         |
| :----- | :----- | :----------- |
| GET    | `/`    | 取得所有車系 |
| GET    | `/:id` | 取得特定車系 |
| POST   | `/`    | 新增車系     |
| PUT    | `/:id` | 更新車系內容 |
| DELETE | `/:id` | 刪除車系     |

### 車型管理 (`/api/trims`)

| 方法   | 路徑   | 說明                                      |
| :----- | :----- | :---------------------------------------- |
| GET    | `/`    | 取得所有車型 (支援 `?model_slug=hs` 過濾) |
| GET    | `/:id` | 取得特定車型詳細規格                      |
| POST   | `/`    | 新增車型                                  |
| PUT    | `/:id` | 更新車型內容                              |
| DELETE | `/:id` | 刪除車型                                  |

### 首頁輪播圖 (`/api/slides`)

| 方法 | 路徑 | 說明                    |
| :--- | :--- | :---------------------- |
| GET  | `/`  | 依排序取得所有輪播圖    |
| POST | `/`  | 新增輪播圖 (管理介面用) |

### 最新消息文章 (`/api/articles`)

| 方法 | 路徑   | 說明                                          |
| :--- | :----- | :-------------------------------------------- |
| GET  | `/`    | 取得文章清單 (可依 `?category=最新活動` 過濾) |
| GET  | `/:id` | 取得文章完整內容 (包含 JSON 格式)             |
| POST | `/`    | 發佈新文章                                    |

## 📂 專案結構

- `controllers/`: 各功能模組的業務邏輯處理中心。
- `models/`: 資料表結構 (Schema) 的定義與關聯設定。
- `routes/`: 定義 API 端點路徑。
- `middleware/`: 中介軟體 (如 JWT 身份驗證、CORS 設定)。
- `config/`: 資料庫連線與全局設定。
- `tests/`: 存放所有測試用的腳本、`.http` 檔案與 Postman 集合。
- `seedAllData.js`: 用於將前端 JS 資料遷移/同步至 MySQL 的核心指令碼。

## 🧪 測試工具

- **Postman**: 匯入 `tests/postman_collection.json`。
- **REST Client**: 可使用 `tests/` 資料夾中的 `.http` 檔案進行測試 (如 `tests/api-tests.http`)。
