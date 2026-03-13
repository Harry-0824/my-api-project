// 這是從前端 src/data 提取的車型資料，用於後端 Seeding
// 包含 colors, equipment, specImages, basicSpecs 等詳細結構

const hsData = {
  name: "HS 1.5T 旗艦版",
  price_display: "939,000",
  main_image: "/media/hs/MG官網_共用圖_690x494_EHS灰.webp",
  booking_link: "https://www.mgmotor.com.tw/testdrive.html",
  online_order_link: "https://www.mgmotor.com.tw/order.html",
  disclaimer: "免責聲明: 此車輛尺寸為標準尺寸, 實際尺寸以交車為準",
  basic_specs_json: [
    { label: "長*寬*高(mm)", value: "4,610*1,876*1,685" },
    { label: "軸距(mm)", value: "2,720" },
    {
      label: "引擎型式",
      value: "MEGA Tech 1.5T缸內直噴渦輪增壓引擎",
    },
    {
      label: "變速箱系統",
      value: "MEGA Tech 7速DCT雙離合器",
    },
    { label: "驅動系統", value: "前輪驅動" },
    {
      label: "懸吊系統(前/後)",
      value: "獨立麥花臣懸吊附防傾桿/獨立多連桿懸吊附防傾桿",
    },
    { label: "最大馬力(ps/rpm)", value: "180/5,600" },
    { label: "最大扭力(kg-m/rpm)", value: "29.1/1,500-4,000" },
  ],
  detailed_specs_json: {
    基本規格: [
      { label: "全長x全寬x全高 (mm)", value: "4,610x1,876x1,685" },
      { label: "軸距 (mm)", value: "2720" },
    ],
    動力系統: [
      { label: "引擎型式", value: "MEGA Tech 1.5T缸內直噴渦輪增壓汽油引擎" },
    ],
  },
  colors_json: [
    {
      name: "電掣白",
      hex: "#FFFFFF",
      imageSrc: "/media/hs/MG官網_共用圖_690x494_HS白.webp",
      swatchSrc: "/media/hs/2022_HS系列_白_color pic.webp",
      dimensionsDisplayImage: {
        src: "/media/hs/車款介紹頁_HS_三視圖_PC_白.webp",
        alt: "HS 1.5T 旗艦版 車輛尺寸-白",
      },
    },
    {
      name: "掠影黑",
      hex: "#2B2B2B",
      imageSrc: "/media/hs/MG官網_共用圖_690x494_HS黑.webp",
      swatchSrc: "/media/hs/2022_HS系列_黑_color pic.webp",
      dimensionsDisplayImage: {
        src: "/media/hs/車款介紹頁_HS_三視圖_PC_黑.webp",
        alt: "HS 1.5T 旗艦版 車輛尺寸-黑",
      },
    },
    {
      name: "沉穩灰",
      hex: "#808080",
      imageSrc: "/media/hs/MG官網_共用圖_690x494_EHS灰.webp",
      swatchSrc: "/media/hs/2022_HS系列_灰_color pic.webp",
      dimensionsDisplayImage: {
        src: "/media/hs/車款介紹頁_HS PHEV_三視圖_PC_灰.webp",
        alt: "HS 1.5T 旗艦版 車輛尺寸-灰",
      },
    },
    {
      name: "風馳紅",
      hex: "#A30000",
      imageSrc: "/media/hs/MG官網_共用圖_690x494_HS紅.webp",
      swatchSrc: "/media/hs/2022_HS系列_紅_color pic.webp",
      dimensionsDisplayImage: {
        src: "/media/hs/車款介紹頁_HS_三視圖_PC_紅.webp",
        alt: "HS 1.5T 旗艦版 車輛尺寸-紅",
      },
    },
  ],
  equipment_json: {
    column1: [
      "MG PILOT 2.0 LV.2 智慧駕駛輔助",
      "ACC智慧型主動車距巡航控制系統",
      "TJA交通壅塞輔助系統",
      "LKA車道保持輔助系統",
      "SAS智能速限輔助系統",
      "AEB自動緊急煞車輔助系統",
      "IHC遠近光燈自動調節系統",
      "BSD盲點偵測系統",
      "360°環景影像輔助系統",
      "6SRS安全輔助氣囊",
      "ESP車身穩定控制系統",
      "TCS循跡防滑控制系統",
      "HDC陡坡緩降控制系統",
      "HSA陡坡起步輔助系統",
    ],
    column2: [
      "賽道之眼LED大燈/LED尾燈",
      "12.3吋數位儀表",
      "10.1吋懸浮式觸控螢幕",
      "256色環艙氣氛燈",
      "Keyless Entry & Push Start",
      "雙區恆溫空調",
      "手機無線充電",
      "一體式賽車座椅",
      "駕駛座六向電動座椅",
      "Trophy套件組",
      "智慧防夾電動尾門",
      "沉浸式全景天窗",
      "18吋燻黑雙色鋁圈",
      "Drive Mode多重駕駛模式",
    ],
  },
  spec_images_json: {
    main: {
      src: "/media/hs/MG官網_共用圖_690x494_EHS灰.webp",
      alt: "HS 1.5T 旗艦版",
    },
  },
};

const zsData = {
  name: "ZS 1.5L 旗艦版",
  price_display: "749,000",
  main_image: "/media/zs/MG-MG ZS官網_BLUE_FA.webp", // 使用 spec_images_json.main.src
  booking_link: "https://www.mgmotor.com.tw/testdrive.html",
  online_order_link: "https://www.mgmotor.com.tw/order.html",
  disclaimer: "免責聲明: 此車輛尺寸為標準尺寸, 實際尺寸以交車為準",
  basic_specs_json: [
    { label: "長*寬*高(mm)", value: "4,323*1,809*1,653" },
    { label: "軸距(mm)", value: "2,585" },
    {
      label: "引擎型式:",
      value: "1.5L DVVT雙連續可變汽門正時汽油引擎",
    },
    {
      label: "變速箱系統:",
      value: "CVT無段變速系統(附模擬8速手自排)",
    },
    { label: "驅動系統", value: "前輪驅動" },
    {
      label: "懸吊系統(前/後):",
      value: "麥花臣式附防傾桿/扭力樑式",
    },
    { label: "最大馬力(ps/rpm)", value: "120/6,000" },
    { label: "最大扭力(kg-m/rpm)", value: "15.3/4,500" },
  ],
  detailed_specs_json: {
    // 假設的詳細規格，這裡暫時留空或填入基本結構
    基本規格: [
      { label: "長*寬*高(mm)", value: "4,323*1,809*1,653" },
      { label: "軸距(mm)", value: "2,585" },
    ],
    動力系統: [
      { label: "引擎型式", value: "1.5L DVVT雙連續可變汽門正時汽油引擎" },
    ],
  },
  colors_json: [
    {
      name: "炫彩藍",
      hex: "#0000FF",
      imageSrc: "/media/zs/MG ZS官網_BLUE_FA.webp",
      swatchSrc: "/media/zs/ZS_官網車色-blue.webp",
      dimensionsDisplayImage: {
        src: "/media/zs/MG-ZS官網網頁_三視圖_PC-1440x375_藍.webp",
        alt: "ZS 1.5L 旗艦版 車輛尺寸",
      },
    },
    {
      name: "炫彩橘",
      hex: "#FF7F50",
      imageSrc: "/media/zs/2023_ZS_Orange_FA.webp",
      swatchSrc: "/media/zs/ZS_官網車色-orange.webp",
      dimensionsDisplayImage: {
        src: "/media/zs/MG-ZS官網網頁_三視圖_PC-1440x375_橘.webp",
        alt: "ZS 1.5L 旗艦版 車輛尺寸",
      },
    },
    {
      name: "亮眼銀",
      hex: "#C0C0C0",
      imageSrc: "/media/zs/2023_ZS_Silver_FA.webp",
      swatchSrc: "/media/zs/ZS_官網車色-silver.webp",
      dimensionsDisplayImage: {
        src: "/media/zs/MG-ZS官網網頁_三視圖_PC-1440x375_銀.webp",
        alt: "ZS 1.5L 旗艦版 車輛尺寸",
      },
    },
    {
      name: "電掣白",
      hex: "#FFFFFF",
      imageSrc: "/media/zs/2023_ZS_White_FA.webp",
      swatchSrc: "/media/zs/ZS_官網車色-white.webp",
      dimensionsDisplayImage: {
        src: "/media/zs/MG-ZS官網網頁_三視圖_PC-1440x375_白.webp",
        alt: "ZS 1.5L 旗艦版 車輛尺寸",
      },
    },
    {
      name: "鋼鐵黑",
      hex: "#000000",
      imageSrc: "/media/zs/2023_ZS_Black_FA.webp",
      swatchSrc: "/media/zs/ZS_官網車色-black.webp",
      dimensionsDisplayImage: {
        src: "/media/zs/MG-ZS官網網頁_三視圖_PC-1440x375_黑.webp",
        alt: "ZS 1.5L 旗艦版 車輛尺寸",
      },
    },
  ],
  equipment_json: {
    column1: [
      "MG PILOT 2.0 LV.2 智慧駕駛輔助",
      "ACC智慧型主動車距巡航控制系統",
      "TJA交通壅塞輔助系統",
      "LKA車道保持輔助系統",
      "SAS智能速限輔助系統",
      "AEB自動緊急煞車輔助系統",
      "IHC遠近光燈自動調節系統",
      "BSD盲點偵測系統",
      "360°環景影像輔助系統",
      "6SRS安全輔助氣囊",
      "ESP車身穩定控制系統",
      "TCS循跡防滑控制系統",
      "HDC陡坡緩降控制系統",
      "HSA陡坡起步輔助系統",
    ],
    column2: [
      "賽道之眼LED大燈/LED尾燈",
      "12.3吋數位儀表",
      "10.1吋懸浮式觸控螢幕",
      "256色環艙氣氛燈",
      "Keyless Entry & Push Start",
      "雙區恆溫空調",
      "手機無線充電",
      "一體式賽車座椅",
      "駕駛座六向電動座椅",
      "Trophy套件組",
      "智慧防夾電動尾門",
      "沉浸式全景天窗",
      "18吋燻黑雙色鋁圈",
      "Drive Mode多重駕駛模式",
    ],
  },
  spec_images_json: {
    main: {
      src: "/media/zs/MG-MG ZS官網_BLUE_FA.webp",
      alt: "ZS 1.5L 旗艦版",
    },
    dimensionsDisplayImage: {
      desktopSrc: "/media/zs/MG-ZS官網網頁_三視圖_PC-1440x375_黑.webp",
      mobileSrc: "/media/zs/MG-ZS官網網頁_三視圖_MB-750x1920_藍.webp",
      alt: "ZS 1.5L 旗艦版 車輛尺寸",
    },
  },
};

module.exports = {
  hsData,
  zsData,
};
