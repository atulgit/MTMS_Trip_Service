const { DataTypes, Model } = require("sequelize");
const { sequelize } = require('../dbconnection');

class Project extends Model { }

Project.init(
    {
        projectId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        project_name: {
            type: DataTypes.STRING
        }
    },
    {
        sequelize, // Pass the connection instance
        modelName: "projects", // Provide the name of the table
        timestamps: false
    }
);

module.exports = {
    Project
};