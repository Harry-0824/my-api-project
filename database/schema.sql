-- 建立資料庫
CREATE DATABASE IF NOT EXISTS mg_website_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mg_website_db;

-- ==========================================
-- 1. 文章與最新消息 (Articles & News)
-- ==========================================

-- 文章主表
CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug_id VARCHAR(50) UNIQUE NOT NULL COMMENT '對應 JS 中的 id (e.g., news-1)',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    publish_date DATE NOT NULL,
    category VARCHAR(50) NOT NULL COMMENT '分類 (e.g., 最新購車優惠)',
    hero_image VARCHAR(255),
    
    -- 核心內容：建議直接存成 JSON，因為你的內容是 Array of Blocks (heading, paragraph, image...)
    content_json JSON COMMENT '儲存 content array 結構',
    
    is_featured BOOLEAN DEFAULT FALSE COMMENT '是否為焦點推薦 (對應 featuredArticleId)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 標籤表
CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- 文章與標籤的中介表 (Many-to-Many)
CREATE TABLE article_tags (
    article_id INT,
    tag_id INT,
    PRIMARY KEY (article_id, tag_id),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- ==========================================
-- 2. 首頁輪播圖 (Slides)
-- ==========================================

CREATE TABLE slides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_type ENUM('desktop', 'mobile') NOT NULL COMMENT '區分電腦版或手機版',
    image_url VARCHAR(255) NOT NULL,
    link_url VARCHAR(255),
    label VARCHAR(50),
    h1_text VARCHAR(100),
    h2_text VARCHAR(100),
    button_text VARCHAR(50),
    h1_color VARCHAR(10) DEFAULT '#000000',
    h2_color VARCHAR(10) DEFAULT '#000000',
    sort_order INT DEFAULT 0 COMMENT '排序權重',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 3. 車輛規格與介紹 (Vehicle Specs)
-- ==========================================

-- 3.1 車系 (Model) - e.g., HS, ZS
CREATE TABLE vehicle_models (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL COMMENT 'e.g., HS & HS PHEV, ZS',
    slug VARCHAR(50) UNIQUE COMMENT 'url 用 slug'
);

-- 3.2 車型 (Trim) - e.g., HS 1.5T 旗艦版-- 3.5/3.6/3.7 整合進來
CREATE TABLE vehicle_trims (
    id INT AUTO_INCREMENT PRIMARY KEY,
    model_id INT NOT NULL,
    name VARCHAR(100) NOT NULL COMMENT 'e.g., HS 1.5T 旗艦版',
    price DECIMAL(10, 0) COMMENT '售價',
    price_display VARCHAR(50) COMMENT '顯示用售價字串 e.g. 91.5 萬元',
    
    -- 圖片與連結
    main_image VARCHAR(255),
    booking_link VARCHAR(255),
    online_order_link VARCHAR(255),
    disclaimer TEXT,
    
    FOREIGN KEY (model_id) REFERENCES vehicle_models(id) ON DELETE CASCADE
);

-- 3.3 車色 (Colors)
CREATE TABLE vehicle_colors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trim_id INT NOT NULL,
    name VARCHAR(50) NOT NULL COMMENT '顏色名稱',
    hex_code VARCHAR(10) COMMENT '色碼',
    image_src VARCHAR(255) COMMENT '車輛外觀圖',
    swatch_src VARCHAR(255) COMMENT '色票圖',
    
    -- 因為尺寸圖有分 mobile/desktop 或是不同角度，用 JSON 存比較靈活-- 改為img
    dimensions_json JSON COMMENT '三視圖資料',
    
    FOREIGN KEY (trim_id) REFERENCES vehicle_trims(id) ON DELETE CASCADE
);

 
