---
paths:
  - "models/**"
  - "config/**"
---

# 資料庫與 Sequelize 規範

## 模型定義慣例

### 標準模型結構

```javascript
// models/EntityName.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const EntityName = sequelize.define('EntityName', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // ... 其他欄位
}, {
  tableName: 'entity_names',   // 蛇底式複數
  timestamps: true              // createdAt, updatedAt
});

module.exports = EntityName;
```

### 命名慣例

| 項目       | 格式                | 範例                      |
| ---------- | ------------------- | ------------------------- |
| 模型名稱   | PascalCase 單數     | `VehicleModel`            |
| 表格名稱   | snake_case 複數     | `vehicle_models`          |
| 欄位名稱   | snake_case          | `model_slug`, `price_start` |
| 外鍵       | snake_case + `_id`  | `model_id`                |

## 現有模型關聯

```javascript
// models/index.js
VehicleModel.hasMany(VehicleTrim, {
  foreignKey: 'model_id',
  as: 'trims'
});

VehicleTrim.belongsTo(VehicleModel, {
  foreignKey: 'model_id'
});
```

## 車輛資料模型

### VehicleModel 欄位

| 欄位          | 型別       | 說明              |
| ------------- | ---------- | ----------------- |
| id            | INTEGER    | 主鍵              |
| name          | STRING     | 車款名稱          |
| slug          | STRING     | URL 友善名稱      |
| subtitle      | STRING     | 副標題            |
| description   | TEXT       | 車款描述          |
| image         | STRING     | 封面圖路徑        |
| price_start   | INTEGER    | 起始價格 (NTD)    |
| price_end     | INTEGER    | 最高價格 (NTD)    |

### VehicleTrim 欄位

| 欄位          | 型別       | 說明              |
| ------------- | ---------- | ----------------- |
| id            | INTEGER    | 主鍵              |
| model_id      | INTEGER    | 外鍵 → VehicleModel |
| name          | STRING     | 車型名稱          |
| price         | INTEGER    | 售價 (NTD)        |
| engine        | STRING     | 引擎規格          |
| horsepower    | INTEGER    | 馬力 (hp)         |
| torque        | STRING     | 扭力              |
| transmission  | STRING     | 變速箱            |

## Sequelize 同步

```javascript
// ✅ 開發環境：自動同步結構
db.sequelize.sync({ alter: true });

// ❌ 禁止在生產環境使用
db.sequelize.sync({ force: true }); // 會刪除所有資料！
```

## 查詢最佳實踐

```javascript
// ✅ 使用 Sequelize 方法
const models = await VehicleModel.findAll();
const model = await VehicleModel.findByPk(id);
const model = await VehicleModel.findOne({ where: { slug } });

// ✅ 關聯查詢
const modelWithTrims = await VehicleModel.findOne({
  where: { slug },
  include: [{ model: VehicleTrim, as: 'trims' }]
});

// ❌ 禁止裸 SQL
const [results] = await sequelize.query('SELECT * FROM vehicle_models');
```

## 種子資料

- 車輛種子資料定義在 `config/vehicleData.js`
- 種子腳本：`scripts/seedAllData.js`
- 執行：`npm run db:seed`
- 種子腳本使用 `destroy({ where: {} })` 清理後再填充（避免重複）
