# 使用 Node.js 20 官方輕量化版本作為基底
FROM node:20-slim

# 設定工作目錄
WORKDIR /usr/src/app

# 複製 package.json 與 package-lock.json
COPY package*.json ./

# 安裝生產環境所需的依賴套件 (忽略開發套件)
RUN npm ci --omit=dev

# 複製其餘專案程式碼
COPY . .

# Cloud Run 會提供一個 PORT 環境變數，通常是 8080 或 3000
# 我們在程式內已經有 process.env.PORT || 3000，這裡設定對應的連接埠
EXPOSE 3000

# 啟動應用程式
CMD [ "npm", "start" ]
