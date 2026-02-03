module.exports = (sequelize, DataTypes) => {
  // 定義 VehicleTrim 模型，對應資料庫中的 vehicle_trims 表
  const VehicleTrim = sequelize.define('VehicleTrim', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    model_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // 外鍵，必填
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 0), // 價格
    },
    price_display: {
      type: DataTypes.STRING(50), // 顯示用價格
    },
    main_image: {
      type: DataTypes.STRING(255), // 主要圖片路徑
    },
    booking_link: {
      type: DataTypes.STRING(255), // 預約連結
    },
    online_order_link: {
      type: DataTypes.STRING(255), // 線上訂購連結
    },
    disclaimer: {
      type: DataTypes.TEXT, // 免責聲明
    },
    basic_specs_json: {
      type: DataTypes.JSON, // 基本規格 JSON 格式
    },
    detailed_specs_json: {
      type: DataTypes.JSON, // 詳細規格 JSON 格式
    },
  }, {
    tableName: 'vehicle_trims',
    timestamps: false,
  });

  // 設定模型關聯
  VehicleTrim.associate = (models) => {
    // 每個車型屬於一個車系
    VehicleTrim.belongsTo(models.VehicleModel, { foreignKey: 'model_id', as: 'model' });
  };

  return VehicleTrim;
};
