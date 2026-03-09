module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define(
    "Article",
    {
      id: {
        type: DataTypes.STRING(100),
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      desc: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      imgSrc: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      date: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      heroImage: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      content: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    },
    {
      tableName: "articles",
      timestamps: true,
    }
  );

  return Article;
};
