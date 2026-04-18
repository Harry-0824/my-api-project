---
paths:
  - "middleware/**"
  - "controllers/**"
  - "routes/**"
---

# 安全規範

## JWT 認證

### Token 簽發

```javascript
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

- 密鑰從 `process.env.JWT_SECRET` 讀取，**禁止硬編碼**
- Token 有效期 24 小時
- Payload 僅包含 `userId` 和 `email`，不放敏感資訊

### Token 驗證（check-auth 中介軟體）

```javascript
// middleware/check-auth.js
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.userData = decoded;
```

- 從 `Authorization: Bearer <token>` header 取得 token
- 驗證失敗回傳 `401`，不暴露失敗原因細節

## 密碼安全

### bcryptjs 加密

```javascript
const bcrypt = require('bcryptjs');

// 註冊：加密
const hashedPassword = await bcrypt.hash(password, 12);

// 登入：驗證
const isMatch = await bcrypt.compare(password, user.password);
```

- Salt rounds 最低 `10`，建議 `12`
- 密碼不以明文儲存、不在日誌中輸出、不在 API 回應中返回

## 輸入驗證

### 必要檢查項目

| 欄位     | 驗證                           |
| -------- | ------------------------------ |
| email    | 格式驗證、長度上限             |
| password | 最少 6 字元                    |
| name     | 非空、長度上限                 |
| id       | 正整數                         |
| slug     | 僅允許 `[a-z0-9-]`            |

### 防禦策略

```javascript
// 1. 型別檢查
if (typeof email !== 'string') { ... }

// 2. 長度限制
if (password.length < 6) { ... }

// 3. SQL Injection — Sequelize 參數化查詢自動防護
// ✅ 安全
await User.findOne({ where: { email } });

// ❌ 危險（禁止使用）
await sequelize.query(`SELECT * FROM users WHERE email = '${email}'`);
```

## 錯誤回應安全

```javascript
// ✅ 正確：通用錯誤訊息
catch (error) {
  console.error('操作失敗:', error);  // 僅在伺服器日誌記錄
  res.status(500).json({ success: false, message: '伺服器內部錯誤' });
}

// ❌ 禁止：洩漏內部資訊
catch (error) {
  res.status(500).json({
    message: error.message,     // 可能包含 SQL 語句
    stack: error.stack          // 暴露程式碼結構
  });
}
```

## 環境變數

| 變數               | 說明                | 安全等級 |
| ------------------ | ------------------- | -------- |
| `JWT_SECRET`       | JWT 簽名密鑰        | 🔴 高    |
| `DB_PASSWORD`      | 資料庫密碼          | 🔴 高    |
| `EMAIL_PASS`       | 郵件服務密碼        | 🔴 高    |
| `DB_HOST`          | 資料庫主機          | 🟡 中    |
| `PORT`             | 服務埠號            | 🟢 低    |

- 所有高安全等級變數禁止出現在程式碼中
- `.env` 檔案必須加入 `.gitignore`
- 提供 `.env.example` 作為範本（不含真實值）

## CORS 設定

```javascript
const cors = require('cors');
app.use(cors());
```

- 開發環境允許所有來源
- 生產環境應限制為前端部署域名
