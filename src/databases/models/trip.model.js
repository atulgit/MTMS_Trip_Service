const { DataTypes, Model } = require("sequelize");
const { sequelize } = require('../dbconnection');

class Trip extends Model { }

Trip.init(
    {
        tripId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING
        },
        userId: {
            type: DataTypes.INTEGER
        },
        projectId: {
            type: DataTypes.INTEGER
        },
        startDate: {
            type: DataTypes.DATE
        },
        endDate: {
            type: DataTypes.DATE
        },
        reason: {
            type: DataTypes.STRING
        },
        travel_mode: {
            type: DataTypes.INTEGER
        },
        hotel_from_date: {
            type: DataTypes.DATE
        },
        hotel_to_date: {
            type: DataTypes.DATE
        },
        from_country: {
            type: DataTypes.STRING
        },
        to_country: {
            type: DataTypes.STRING
        },
        from_city: {
            type: DataTypes.STRING
        },
        to_city: {
            type: DataTypes.STRING
        },
        is_approved: {
            type: DataTypes.INTEGER
        }
    },
    {
        sequelize, // Pass the connection instance
        modelName: "trips", // Provide the name of the table
        timestamps: false
    }
);

module.exports = {
    Trip
};