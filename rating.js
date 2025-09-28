const { DataTypes, Model } = require('sequelize');

class Rating extends Model {
  static initModel(sequelize) {
    Rating.init({
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      score: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
      comment: { type: DataTypes.STRING(400), allowNull: true }
    }, { sequelize, modelName: 'rating' });
  }
}

module.exports = Rating;
