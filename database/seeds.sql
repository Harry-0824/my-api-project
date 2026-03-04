-- 1. 建立車系 (Models)
INSERT INTO vehicle_models (id, name, slug) VALUES 
(1, 'MG HS', 'mg-hs'),
(2, 'MG ZS', 'mg-zs'),
(3, 'MG4 EV', 'mg4-ev');

-- 2. 建立車型 (Trims)
-- MG HS 車型
INSERT INTO vehicle_trims (model_id, name, price, price_display, main_image, basic_specs_json, detailed_specs_json) VALUES 
(1, '1.5T 旗艦版', 915000, '91.5 萬', '/images/hs-15t.jpg', 
 '{"engine": "1.5T 缸內直噴渦輪增壓", "power": "180ps / 29.1kgm", "transmission": "7速 DCT"}', 
 '[{"category": "動力", "items": [{"label": "排氣量", "value": "1490cc"}]}]'
),
(1, 'PHEV 馭電版', 1219000, '121.9 萬', '/images/hs-phev.jpg', 
 '{"engine": "1.5T + 永磁同步馬達", "power": "綜效 291ps / 49kgm", "transmission": "10速智能變速箱"}', 
 '[{"category": "動力", "items": [{"label": "純電里程", "value": "72km"}]}]'
);

-- MG ZS 車型
INSERT INTO vehicle_trims (model_id, name, price, price_display, main_image, basic_specs_json, detailed_specs_json) VALUES 
(2, '旗艦版', 749000, '74.9 萬', '/images/zs-flagship.jpg', 
 '{"engine": "1.5L DVVT 雙連續可變汽門正時", "power": "120ps / 15.3kgm", "transmission": "CVT 智慧無段變速"}', 
 '[{"category": "安全", "items": [{"label": "MG PILOT", "value": "2.0 Level 2"}]}]'
);

-- MG4 EV 車型
INSERT INTO vehicle_trims (model_id, name, price, price_display, main_image, basic_specs_json, detailed_specs_json) VALUES 
(3, 'EV 旗艦版', 999000, '99.9 萬', '/images/mg4-ev.jpg', 
 '{"engine": "後置永磁同步馬達", "power": "170ps / 25.5kgm", "range": "435km (WLTP)"}', 
 '[{"category": "電池", "items": [{"label": "電池容量", "value": "51 kWh"}]}]'
),
(3, 'XPOWER', 1189000, '118.9 萬', '/images/mg4-xpower.jpg', 
 '{"engine": "雙馬達四驅", "power": "435ps / 61.2kgm", "range": "385km (WLTP)"}', 
 '[{"category": "性能", "items": [{"label": "0-100km/h", "value": "3.8秒"}]}]'
);