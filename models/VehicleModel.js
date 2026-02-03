module.exports = (sequelize, DataTypes) => {
  // 定義 VehicleModel 模型，對應資料庫中的 vehicle_models 表
  const VehicleModel = sequelize.define('VehicleModel', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,    // 設定為主鍵
      autoIncrement: true, // 自動遞增
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,    // 不允許為空
    },
    slug: {
      type: DataTypes.STRING(50),
      unique: true,        // 唯一值
    },
  }, {
    tableName: 'vehicle_models', // 指定資料表名稱
    timestamps: false,           // 關閉時間戳記 (created_at, updated_at)，因為原 Schema 無此欄位
  });

  // 設定模型關聯
  VehicleModel.associate = (models) => {
    // 一個車系 (VehicleModel) 擁有多個車型 (VehicleTrim)
    VehicleModel.hasMany(models.VehicleTrim, { foreignKey: 'model_id', as: 'trims' });
  };

  return VehicleModel;
};
