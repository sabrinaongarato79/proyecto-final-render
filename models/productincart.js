"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductInCart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  ProductInCart.associate = (models) => {
    ProductInCart.belongsTo(models.Product, {
      targetKey: "id",
      foreignKey: "productId",
    });

    ProductInCart.belongsTo(models.Cart, {
      targetKey: "id",
      foreignKey: "cartId",
    });
  };

  ProductInCart.init(
    {
      cartId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "ProductInCart",
    }
  );
  return ProductInCart;
};
