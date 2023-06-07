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
        userName: {
            type: new DataTypes.VIRTUAL(DataTypes.STRING, ['name']),
            get: function () {
                return this.get('name');
            }
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