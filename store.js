const { DataTypes, Model } = require('sequelize');

class Store extends Model {
  static initModel(sequelize) {
    Store.init({
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      email: { type: DataTypes.STRING, allowNull: true, validate: { isEmail: true } },
      address: { type: DataTypes.STRING(400), allowNull: true }
    }, { sequelize, modelName: 'store' });
  }
}

module.exports = Store;
