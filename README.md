# MG Motor Backend API (`my-api-project`)

這個專案是 **MG Motor 前端專案** 的後端 API，提供車型資料、登入驗證與內容資料服務。

- 前端專案：<https://github.com/Harry-0824/MG-motor>
- 後端角色：提供前端所需的資料查詢、管理操作與驗證機制，組成完整全端作品。

## 專案定位

此 API 以作品集展示與面試說明為目標，重點在於：

- 以 RESTful API 支援前端頁面資料需求
- 以 JWT 保護需要登入權限的操作
- 以 Sequelize 管理資料庫存取
- 可部署於 Google Cloud Run

## 技術棧（依目前程式碼與 `package.json`）

- Node.js
- Express
- Sequelize
- PostgreSQL（`pg` / `pg-hstore`）
- JWT（`jsonwebtoken`）
- bcryptjs
- CORS
- Helmet
- express-rate-limit
- Jest / Supertest（測試）

## 部署說明

本專案的部署目標平台為 **Google Cloud Run**。

## 主要 API 範圍

目前路由主要包含：

- `/api/auth`：註冊、登入、忘記密碼、重設密碼、個人資料
- `/api/models`：車型資料 CRUD
- `/api/trims`：車款等級資料 CRUD
- `/api/slides`：首頁輪播資料查詢與新增
- `/api/articles`：文章資料查詢與新增

> 以上內容對應 `routes/` 目前檔案：`auth.js`、`models.js`、`trims.js`、`slides.js`、`articles.js`。

## 本機開發

1. 安裝依賴

```bash
npm install
```

2. 建立環境變數檔

請複製 `.env.example` 為 `.env`，再填入本機實際值。

```bash
# Linux / macOS
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

3. 啟動服務

```bash
npm start
```

## 環境變數

請使用 `.env.example` 作為欄位基準，常用欄位包含：

- `PORT`
- `NODE_ENV`
- `FRONTEND_URL`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`（程式同時相容 `DB_PASS`）
- `JWT_SECRET`
- `EMAIL_SERVICE`
- `EMAIL_USER`
- `EMAIL_PASS`

## 可用 npm scripts

- `npm start`：啟動 API 服務（`node index.js`）
- `npm run db:setup`：初始化資料庫
- `npm run db:seed`：載入種子資料
- `npm test`：執行 Jest 測試

## 測試

```bash
npm test
```

## 作品集實作重點（面試可說明）

- 如何將前端資料需求拆成可維護的 API 路由與控制器
- 如何使用 JWT middleware 控制受保護端點
- 如何使用 Sequelize 封裝資料操作、降低 SQL 耦合
- 如何在 API 層加入安全中介層（Helmet、Rate Limit、CORS）
- 如何讓前後端分離架構可部署到雲端（Cloud Run）

## 目前狀態與限制

- 此專案以作品集用途為主，定位為支援前端展示的後端 API。
- 功能聚焦在核心資料與驗證流程，未涵蓋大型商業系統的完整營運需求（例如多租戶、複雜權限治理、完整稽核流程等）。
