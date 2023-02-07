'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Order.associate = (models) => {
    Order.belongsTo(models.User, { targetKey: "id", foreignKey: "userId" });
  };

  Order.init({
    totalPrice: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};