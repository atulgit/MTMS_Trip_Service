const { DataTypes, Model } = require("sequelize");
const { sequelize } = require('../dbconnection');

class ApproverGroup extends Model { }

ApproverGroup.init(
    {
        usr_to_grp_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER
        },
        grp_id: {
            type: DataTypes.INTEGER
        }
    },
    {
        sequelize, // Pass the connection instance
        modelName: "approvers_to_grp_maps", // Provide the name of the table
        timestamps: false
    }
);

module.exports = {
    ApproverGroup
};