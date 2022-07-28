const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize, Sequelize) =>
  sequelize.define(
    "dislikes",
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
      modelName: "dislike",
    }
  );
