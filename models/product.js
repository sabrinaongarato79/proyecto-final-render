"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Product.associate = (models) => {
    Product.belongsTo(models.User, { targetKey: "id", foreignKey: "userId" });
  };

  Product.init(
    {
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      availableQty: DataTypes.INTEGER,
      status: DataTypes.BOOLEAN,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
