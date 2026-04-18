---
description: "建立新的 API 端點。自動產生 Route、Controller 並掛載到 index.js。"
argument-hint: "資源名稱，例如: dealers"
---

# 建立新 API 端點

## 使用時機

- 需要為新資源建立 CRUD API
- 需要新增單一功能端點

## 流程

### 1. 確認端點資訊

向使用者確認：

- 資源名稱（複數，例如 `dealers`）
- 需要哪些操作（GET 列表 / GET 單筆 / POST / PUT / DELETE）
- 是否需要認證保護
- 資料模型欄位
- 是否需要與現有模型建立關聯

### 2. 建立 Sequelize Model

`models/EntityName.js`

```javascript
const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const EntityName = sequelize.define(
  "EntityName",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // 依需求定義欄位
  },
  {
    tableName: "entity_names",
    timestamps: true,
  },
);

module.exports = EntityName;
```

### 3. 在 `models/index.js` 註冊

```javascript
const EntityName = require("./EntityName");
// 如有關聯，在此定義
```

### 4. 建立 Controller

`controllers/entityNameController.js`

```javascript
const { EntityName } = require("../models");

exports.getAll = async (req, res) => {
  try {
    const items = await EntityName.findAll();
    res.json(items);
  } catch (error) {
    console.error("取得資料失敗:", error);
    res.status(500).json({ success: false, message: "伺服器內部錯誤" });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await EntityName.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "資料不存在" });
    }
    res.json(item);
  } catch (error) {
    console.error("取得資料失敗:", error);
    res.status(500).json({ success: false, message: "伺服器內部錯誤" });
  }
};
```

### 5. 建立 Route

`routes/entityNames.js`

```javascript
const express = require("express");
const router = express.Router();
const controller = require("../controllers/entityNameController");
const checkAuth = require("../middleware/check-auth");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
// 需認證的端點加上 checkAuth
router.post("/", checkAuth, controller.create);

module.exports = router;
```

### 6. 在 `index.js` 掛載

```javascript
const entityNamesRouter = require("./routes/entityNames");
app.use("/api/entity-names", entityNamesRouter);
```

### 7. 更新前端對接

提醒使用者在 MG-motor 前端的 `src/services/api.js` 中新增對應函式。

### 8. 完成後

- 使用 `tests/api-tests.http` 或 Postman 測試端點
- 確認回應格式正確
