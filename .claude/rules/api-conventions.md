---
paths:
  - "controllers/**"
  - "routes/**"
---

# API 設計慣例

## RESTful 端點命名

| 操作     | 方法     | 端點格式             | 範例                   |
| -------- | -------- | -------------------- | ---------------------- |
| 列表     | GET      | `/resource`          | `GET /api/models`      |
| 單筆     | GET      | `/resource/:id`      | `GET /api/models/1`    |
| 篩選     | GET      | `/resource?key=val`  | `GET /api/trims?model_slug=hs` |
| 新增     | POST     | `/resource`          | `POST /api/models`     |
| 更新     | PUT      | `/resource/:id`      | `PUT /api/models/1`    |
| 刪除     | DELETE   | `/resource/:id`      | `DELETE /api/models/1` |

## 統一回應格式

### 成功回應

```javascript
// 列表
res.json(items); // Sequelize 回傳陣列

// 單筆
res.json(item); // Sequelize 回傳物件

// 新增/更新
res.status(201).json(newItem);
res.json(updatedItem);
```

### 錯誤回應

```javascript
// 400 客戶端錯誤
res.status(400).json({ success: false, message: '請提供必要欄位' });

// 401 未認證
res.status(401).json({ success: false, message: '請先登入' });

// 404 找不到
res.status(404).json({ success: false, message: '資料不存在' });

// 500 伺服器錯誤
res.status(500).json({ success: false, message: '伺服器內部錯誤' });
```

## Controller 結構

```javascript
// 標準 Controller 模式
exports.actionName = async (req, res) => {
  try {
    // 1. 輸入驗證
    // 2. 業務邏輯
    // 3. 回應
  } catch (error) {
    console.error('操作描述失敗:', error);
    res.status(500).json({ success: false, message: '伺服器內部錯誤' });
  }
};
```

### 輸入驗證

```javascript
// 必要欄位檢查
const { name, price } = req.body;
if (!name || !price) {
  return res.status(400).json({ success: false, message: '請提供 name 和 price' });
}

// 型別檢查
if (typeof price !== 'number' || price < 0) {
  return res.status(400).json({ success: false, message: 'price 必須為正數' });
}
```

## Route 掛載

```javascript
// index.js 中的標準掛載
app.use('/api/resource', require('./routes/resource'));
```

- 路由前綴統一為 `/api/`
- 路由檔案命名使用複數（`models.js`、`trims.js`、`articles.js`）
- 需認證的端點使用 `checkAuth` 中介軟體

## 認證端點

| 端點                        | 方法 | 需認證 | 說明          |
| --------------------------- | ---- | ------ | ------------- |
| `/api/auth/register`        | POST | ❌     | 註冊          |
| `/api/auth/login`           | POST | ❌     | 登入          |
| `/api/auth/forgot-password` | POST | ❌     | 忘記密碼      |

- 公開端點（GET 列表/詳情）不需認證
- 寫入端點（POST/PUT/DELETE）需要 JWT 認證
