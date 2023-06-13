const { DataTypes, Model } = require("sequelize");
const { sequelize } = require('../dbconnection');

class GroupApprover extends Model { }

GroupApprover.init(
    {
        grp_approver_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        from_grp_id: {
            type: DataTypes.INTEGER
        },
        to_grp_id: {
            type: DataTypes.INTEGER
        },
        from_grp_type: {
            type: DataTypes.INTEGER
        },
        to_grp_type: {
            type: DataTypes.INTEGER
        }
    },
    {
        sequelize, // Pass the connection instance
        modelName: "grp_approvers", // Provide the name of the table
        timestamps: false
    }
);

module.exports = {
    GroupApprover
};