const { DataTypes, Model } = require("sequelize");
const { sequelize } = require('../dbconnection');

class Group extends Model { }

Group.init(
    {
        grp_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        grp_name: {
            type: DataTypes.STRING
        },
        grp_type: {
            type: DataTypes.INTEGER
        },
        project_id: {
            type: DataTypes.INTEGER
        }
    },
    {
        sequelize, // Pass the connection instance
        modelName: "groups", // Provide the name of the table
        timestamps: false
    }
);

module.exports = {
    Group
};