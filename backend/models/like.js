const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize, Sequelize) =>
  sequelize.define(
    "likes",
    {
      postId: {
        type: DataTypes.STRING,
      },
      userId: {
        type: DataTypes.STRING,
      },
    },

    {
      sequelize,
      modelName: "like",
    }
  );
