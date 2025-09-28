const { Sequelize } = require('sequelize');
require('dotenv').config();

const DB_DIALECT = process.env.DB_DIALECT || 'postgres';

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || (DB_DIALECT === 'postgres' ? 5432 : 3306),
  dialect: DB_DIALECT,
  logging: false
});

module.exports = sequelize;
