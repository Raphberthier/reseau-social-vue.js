const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize, Sequelize) =>
  sequelize.define(
    "user",
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      admin: {
        type: DataTypes.BOOLEAN, 
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    /*  friends: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      }*/
    },
    {
      sequelize,
      modelName: "user",
    }
  );
