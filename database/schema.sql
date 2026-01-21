-- 建立資料庫
CREATE DATABASE IF NOT EXISTS mg_website_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mg_website_db;

-- ==========================================
-- 1. 文章與最新消息 (Articles & News) - 保持不變
-- ==========================================

CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    publish_date DATE NOT NULL,
    category VARCHAR(50) NOT NULL,
    hero_image VARCHAR(255),
    content_json JSON COMMENT '儲存 content array 結構',
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE article_tags (
    article_id INT,
    tag_id INT,
    PRIMARY KEY (article_id, tag_id),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- ==========================================
-- 2. 首頁輪播圖 (Slides) - 保持不變
-- ==========================================

CREATE TABLE slides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_type ENUM('desktop', 'mobile') NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    link_url VARCHAR(255),
    label VARCHAR(50),
    h1_text VARCHAR(100),
    h2_text VARCHAR(100),
    button_text VARCHAR(50),
    h1_color VARCHAR(10) DEFAULT '#000000',
    h2_color VARCHAR(10) DEFAULT '#000000',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 3. 車輛規格與介紹 (Vehicle Specs) - 已整合
-- ==========================================

-- 3.1 車系 (Model)
CREATE TABLE vehicle_models (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE
);

-- 3.2 車型 (Trim) - 整合了 3.5, 3.6, 3.7 的規格資料
CREATE TABLE vehicle_trims (
    id INT AUTO_INCREMENT PRIMARY KEY,
    model_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 0),
    price_display VARCHAR(50) COMMENT '顯示用售價 e.g. 91.5 萬元',
    
    -- 圖片與連結
    main_image VARCHAR(255),
    booking_link VARCHAR(255),
    online_order_link VARCHAR(255),
    disclaimer TEXT,

    -- [整合點] 原 3.5 基本規格摘要
    -- 格式建議: [{"label": "引擎型式", "value": "1.5T..."}, {...}]
    basic_specs_json JSON COMMENT '基本規格摘要 JSON',

    -- [整合點] 原 3.6 & 3.7 詳細規格內容
    -- 格式建議: [{"category": "動力系統", "items": [{"label": "排氣量", "value": "1490", "is_highlight": true}]}]
    detailed_specs_json JSON COMMENT '詳細規格分類與內容 JSON',
    
    FOREIGN KEY (model_id) REFERENCES vehicle_models(id) ON DELETE CASCADE
);

-- 3.3 車色 (Colors) - 修正三視圖結構
CREATE TABLE vehicle_colors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trim_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    hex_code VARCHAR(10),
    image_src VARCHAR(255) COMMENT '車輛外觀圖',
    swatch_src VARCHAR(255) COMMENT '色票圖',
    
    -- [修正點] 改為明確的圖片路徑欄位，不再使用 JSON
    dimension_image_desktop VARCHAR(255) COMMENT '電腦版三視圖圖片路徑',
    dimension_image_mobile VARCHAR(255) COMMENT '手機版三視圖圖片路徑',
    
    FOREIGN KEY (trim_id) REFERENCES vehicle_trims(id) ON DELETE CASCADE
);

-- 3.4 重點配備 (Equipment) - 保留此表以便於前端排版管理
CREATE TABLE vehicle_equipments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trim_id INT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    column_group TINYINT DEFAULT 1 COMMENT '1 或 2 欄',
    sort_order INT DEFAULT 0,
    FOREIGN KEY (trim_id) REFERENCES vehicle_trims(id) ON DELETE CASCADE
);