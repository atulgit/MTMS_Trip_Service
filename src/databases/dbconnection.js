
const { Sequelize, DataTypes, Model } = require("sequelize");

const sequelize = new Sequelize(
    'Metyis_Trip',
    'root',
    'Pass@123',
    {
        host: 'localhost',
        dialect: 'mysql'
    }
);

module.exports = {
    sequelize
};