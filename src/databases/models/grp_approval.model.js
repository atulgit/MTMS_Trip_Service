const { DataTypes, Model } = require("sequelize");
const { sequelize } = require('../dbconnection');

class GroupApproval extends Model { }

GroupApproval.init(
    {
        grp_approval_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        trip_id: {
            type: DataTypes.INTEGER
        },
        status: {
            type: DataTypes.INTEGER
        },
        grp_approver_id: {
            type: DataTypes.INTEGER
        },
        approver_user_id: {
            type: DataTypes.INTEGER
        }
    },
    {
        sequelize, // Pass the connection instance
        modelName: "grp_approvals", // Provide the name of the table
        timestamps: false
    }
);

module.exports = {
    GroupApproval
};