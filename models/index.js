const Sequelize = require('sequelize');
const sequelize = require('../config/sequelize');

const db = {
  sequelize,
  Sequelize,
};

// 引入模型 (Models)
// 這裡將 sequelize 實例與資料型態 (DataTypes) 傳入模型定義檔
db.VehicleModel = require('./VehicleModel')(sequelize, Sequelize);
db.VehicleTrim = require('./VehicleTrim')(sequelize, Sequelize);
db.User = require('./User')(sequelize, Sequelize);

// 定義關聯 (Associations)
// 遍歷所有模型，若模型中有定義 associate 方法則執行，用來建立資料表之間的關係
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
