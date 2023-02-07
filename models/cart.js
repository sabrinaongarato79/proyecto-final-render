"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, { targetKey: "id", foreignKey: "userId" });
  };

  Cart.init(
    {
      userId: DataTypes.INTEGER,
      totalPrice: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Cart",
    }
  );
  return Cart;
};
