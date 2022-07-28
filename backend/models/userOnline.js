const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize, Sequelize) =>
  sequelize.define(
    "userOnline",
    {
      userOnline: {
        type: DataTypes.STRING,
      },
      lastConnection: Sequelize.DATE,
    },
    {
      sequelize,
      modelName: "userOnline",
    }
   

  );
