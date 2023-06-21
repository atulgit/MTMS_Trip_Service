const { DataTypes, Model } = require("sequelize");
const { sequelize } = require('../dbconnection');

class Users extends Model { }
Users.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: new DataTypes.STRING
        },
        email: {
            type: new DataTypes.STRING
        },
        employeeCode: {
            type: new DataTypes.STRING
        },
        userType: {
            type: new DataTypes.INTEGER
        }
    },
    {
        sequelize, // Pass the connection instance
        modelName: "users", // Provide the name of the table
        timestamps: false
    }
);

module.exports = {
    Users
};