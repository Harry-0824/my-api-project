module.exports = (sequelize, DataTypes) => {
  const HomeSlide = sequelize.define(
    "HomeSlide",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      image: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      subtitle: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      label: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      buttonText: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "瞭解更多",
      },
      h1Color: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      h2Color: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      link: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM("desktop", "mobile"),
        allowNull: false,
        defaultValue: "desktop",
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: "home_slides",
      timestamps: false,
    }
  );

  return HomeSlide;
};
