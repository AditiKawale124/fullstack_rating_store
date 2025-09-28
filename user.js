const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');

class User extends Model {
  static initModel(sequelize) {
    User.init({
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
          len: { args: [20, 60], msg: 'Name must be 20-60 characters' }
        }
      },
      email: { type: DataTypes.STRING, unique: true, allowNull: false, validate: { isEmail: true }},
      address: { type: DataTypes.STRING(400), allowNull: true, validate: { len: [0, 400] } },
      password: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.ENUM('admin','user','owner'), defaultValue: 'user' }
    }, { sequelize, modelName: 'user' });

    User.beforeCreate(async (user) => {
      user.password = await bcrypt.hash(user.password, 10);
    });

    User.beforeUpdate(async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    });
  }

  async checkPassword(plain) {
    return bcrypt.compare(plain, this.password);
  }
}

module.exports = User;
