"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductInOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  ProductInOrder.associate = (models) => {
    ProductInOrder.belongsTo(models.Order, {
      targetKey: "id",
      foreignKey: "orderId",
    });

    ProductInOrder.belongsTo(models.Product, {
      targetKey: "id",
      foreignKey: "productId",
    });
  };

  ProductInOrder.init(
    {
      orderId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "ProductInOrder",
    }
  );
  return ProductInOrder;
};
