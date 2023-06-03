// import Enumerable from 'linq'
const Enumerable = require('linq');

const User = require('../models/user.model');

const createTrip = async (req, res) => {
    var body = req.body;
    var json = JSON.parse(JSON.stringify(body));


    try {
        const tripId = await User.createTrip(parseInt(json["userId"]), json["name"], json["reason"],
            json["startDate"], json["endDate"], parseInt(json["projectId"]),
            parseInt(json["travelMode"]), json["hotelFromDate"], json["hotelToDate"], json["fromCountry"],
            json["toCountry"], json["fromCity"], json["toCity"]);

        var json = { tripId: tripId };

        res.send({
            statusCode: 200,
            statusMessage: 'Ok',
            message: 'Successfully retrieved all the users.',
            data: JSON.stringify(json),
        });
    } catch (err) {
        res.status(500).send({ statusCode: 500, statusMessage: 'Internal Server Error', message: null, data: null });
    }
};

const updateTrip = async (req, res) => {
    var body = req.body;
    var json = JSON.parse(JSON.stringify(body));


    try {
        await User.updateTrip(parseInt(json["tripId"]), json["name"], json["fromLocation"], json["toLocation"]);


        res.send({
            statusCode: 200,
            statusMessage: 'Ok',
            message: 'Successfully retrieved all the users.',
            data: JSON.stringify(json),
        });
    } catch (err) {
        res.status(500).send({ statusCode: 500, statusMessage: 'Internal Server Error', message: null, data: null });
    }
};

const sendForApproval = async (req, res) => {
    var body = req.body;
    var json = JSON.parse(JSON.stringify(body));

    try {
        const users = await User.sendForApproval(parseInt(json["tripId"]), parseInt(json["userId"]));

        res.send({
            statusCode: 200,
            statusMessage: 'Ok',
            message: 'Successfully retrieved all the users.',
            data: JSON.stringify(users),
        });
    } catch (err) {
        res.status(500).send({ statusCode: 500, statusMessage: 'Internal Server Error', message: null, data: null });
    }
};

const approveTrip = async (req, res) => {
    var body = req.body;
    var json = JSON.parse(JSON.stringify(body));

    try {
        const result = await User.approveTrip(json["tripId"], json["approverId"], json["userId"]);

        res.send({
            statusCode: 200,
            statusMessage: 'Ok',
            message: 'Successfully retrieved all the users.',
            data: null,
        });
    } catch (err) {
        res.status(500).send({ statusCode: 500, statusMessage: 'Internal Server Error', message: null, data: null });
    }
};

const rejectTrip = async (req, res) => {
    var body = req.body;
    var json = JSON.parse(JSON.stringify(body));

    try {
        const result = await User.rejectTrip(parseInt(json["tripId"]), parseInt(json["approverId"]), parseInt(json["userId"]));

        res.send({
            statusCode: 200,
            statusMessage: 'Ok',
            message: 'Successfully retrieved all the users.',
            data: null,
        });
    } catch (err) {
        res.status(500).send({ statusCode: 500, statusMessage: 'Internal Server Error', message: null, data: null });
    }
};


const getUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.send({
            statusCode: 200,
            statusMessage: 'Ok',
            message: 'Successfully retrieved all the users.',
            data: JSON.stringify(users),
        });
    } catch (err) {
        res.status(500).send({ statusCode: 500, statusMessage: 'Internal Server Error', message: null, data: null });
    }
};

const getProjects = async (req, res) => {
    try {
        const projects = await User.getProjects();

        res.send({
            statusCode: 200,
            statusMessage: 'Ok',
            message: 'Successfully retrieved all the users.',
            data: JSON.stringify(projects),
        });
    } catch (err) {
        res.status(500).send({ statusCode: 500, statusMessage: 'Internal Server Error', message: null, data: null });
    }
};

const loginUser = async (req, res) => {
    try {
        var body = req.body;
        var json = JSON.parse(JSON.stringify(body));

        const email = req.params.email;
        const users = await User.login(json["email"], json["password"]);

        if (users.length == 1) {
            res.send({
                statusCode: 200,
                statusMessage: 'Ok',
                message: 'Successfully retrieved all the users.',
                data: users[0],
            });
        }
        else {
            res.send({
                statusCode: 1008,
                statusMessage: 'Ok',
                message: 'Successfully retrieved all the users.',
                data: null,
            });
        }

        // res.send({
        //     statusCode: 200,
        //     statusMessage: 'Ok',
        //     message: 'Successfully retrieved all the users.',
        //     data: users[0],
        // });
    } catch (err) {
        res.status(500).send({ statusCode: 500, statusMessage: 'Internal Server Error', message: null, data: null });
    }
}

const addUser = async (req, res) => {
    var body = req.body;
    var json = JSON.parse(JSON.stringify(body));

    try {
        const user = new User(json["name"], json["email"], json["employeeCode"], json["userType"]);
        var result = await user.save();

        if (json["isLastAproover"] != 1)
            await user.saveAproover(result[0].insertId, parseInt(json["aprooverId"]), parseInt(json["isLastAproover"]));

        res.status(201).send({
            statusCode: 201,
            statusMessage: 'Created',
            message: 'Successfully created a user.',
            data: null,
        });
    } catch (err) {
        res.status(500).send({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: null,
            data: null,
        });
    }
};

const getOthersTrips = async (req, res) => {
    var userId = req.query.userId;

    try {
        var result = await User.getOthersTrips(userId);
        var trips = [];
        var tripDetail;

        var current_id;
        var index = 0;
        for (var i = 0; i < result.length; i++) {
            var trip = result[i];
            if (current_id != trip.tripId) {
                var tripApprovals = result.filter(function filterApprovals(trp) {
                    if (trp.tripId == trip.tripId) return true;
                });
                var nonApprovals = tripApprovals.filter(function nonApprovalsFilter(apr) {
                    if (apr.isAprooved != 2) return true;
                });
                var isTripApproved = nonApprovals.length > 0 ? 0 : 2;
                tripDetail = getTripObject(trip);
                tripDetail.isApproved = isTripApproved;
                tripDetail.approvals = tripApprovals;
                trips[index++] = tripDetail;
            }
            else {

            }

            current_id = trip.tripId;
        }

        res.status(200).send({
            statusCode: 201,
            statusMessage: 'Created',
            message: 'Successfully created a user.',
            data: JSON.stringify(trips),
        });
    } catch (err) {
        res.status(500).send({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: null,
            data: null,
        });
    }
}

function getTripObject(trip) {
    return {
        tripId: trip.tripId,
        tripName: trip.name,
        toCountry: trip.to_country,
        fromCountry: trip.from_country,
        toCity: trip.to_city,
        fromCity: trip.from_city,
        startDate: trip.startDate,
        endDate: trip.endDate,
        hotelFromDate: trip.hotel_from_date,
        hotelToDate: trip.hotel_to_date,
        reason: trip.reason,
        travelMode: trip.travel_mode,
        projectId: trip.projectId
    };
}

const getTripDetail = async (req, res) => {
    var tripId = req.query.tripId;

    try {
        var result = await User.getTripDetail(tripId);
        var tripDetail;

        var current_id;
        var index = 0;


        for (var i = 0; i < result.length; i++) {
            var trip = result[i];
            if (current_id != trip.tripId) { //if current trip is new trip
                var tripApprovals = result.filter(function filterApprovals(trp) {
                    if (trp.tripId == trip.tripId) return true;
                });
                var nonApprovals = tripApprovals.filter(function nonApprovalsFilter(apr) {
                    if (apr.isAprooved != 2) return true;
                });
                var isTripApproved = nonApprovals.length > 0 ? 0 : 2;
                tripDetail = getTripObject(trip);
                tripDetail.isApproved = isTripApproved;
                tripDetail.approvals = tripApprovals;
            }
            else {

            }

            current_id = trip.tripId;

        }

        res.status(200).send({
            statusCode: 201,
            statusMessage: 'Created',
            message: 'Successfully created a user.',
            data: JSON.stringify(tripDetail),
        });
    } catch (err) {
        res.status(500).send({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: null,
            data: null,
        });
    }
};

const getMyTrips = async (req, res) => {
    var userId = req.query.userId;

    try {
        var result = await User.getMyTrips(userId);
        var trips = [];

        var current_id;
        var index = 0;

        for (var i = 0; i < result.length; i++) {
            var trip = result[i];
            if (current_id != trip.tripId) { //if current trip is new trip
                var tripApprovals = result.filter(function filterApprovals(trp) {
                    if (trp.tripId == trip.tripId) return true;
                });
                var nonApprovals = tripApprovals.filter(function nonApprovalsFilter(apr) {
                    if (apr.isAprooved != 2) return true;
                });
                var isTripApproved = nonApprovals.length > 0 ? 0 : 2;
                var tripObject = getTripObject(trip);
                tripObject.isApproved = isTripApproved;
                tripObject.approvals = tripApprovals;
                trips[index++] = tripObject;
            }
            else {

            }

            current_id = trip.tripId;

        }

        res.status(200).send({
            statusCode: 201,
            statusMessage: 'Created',
            message: 'Successfully created a user.',
            data: JSON.stringify(trips),
        });
    } catch (err) {
        res.status(500).send({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: null,
            data: null,
        });
    }
};

const getApprovedTrips = async (req, res) => {
    var userId = req.query.userId;

    try {
        var result = await User.getApprovedTrips();
        var trips = [];

        var current_id;
        var index = 0;
        for (var i = 0; i < result.length; i++) {
            var trip = result[i];
            if (current_id != trip.tripId) {
                var tripApprovals = result.filter(function filterApprovals(trp) {
                    if (trp.tripId == trip.tripId) return true;
                });
                trips[index++] = { tripId: trip.tripId, tripName: trip.name, toLocation: trip.toLocation, isApproved: 2, fromLocation: trip.fromLocation, approvals: tripApprovals };
            }
            else {

            }

            current_id = trip.tripId;

        }

        res.status(200).send({
            statusCode: 201,
            statusMessage: 'Created',
            message: 'Successfully created a user.',
            data: JSON.stringify(trips),
        });
    } catch (err) {
        res.status(500).send({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: null,
            data: null,
        });
    }
};

function filterApprovals(trip, tripId) {
    if (trip.tripId == tripId) return true;
}

const updateUser = async (req, res) => {
    const id = req.params.id;
    const { firstName, lastName, age } = req.body;
    if (!firstName || !firstName.trim() || !lastName || !lastName.trim() || age == null || age < 0)
        return res.status(400).send({ statusCode: 400, statusMessage: 'Bad Request', message: null, data: null });

    try {
        await User.findByIdAndUpdate(id, req.body);

        return res.status(202).send({
            statusCode: 202,
            statusMessage: 'Accepted',
            message: 'Successfully updated a user.',
            data: null,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: null,
            data: null,
        });
    }
};

const deleteUser = async (req, res) => {
    const id = req.params.id;

    try {
        await User.findByIdAndDelete(id);

        res.send({
            statusCode: 200,
            statusMessage: 'Ok',
            message: 'Successfully deleted a user.',
            data: null,
        });
    } catch (err) {
        res.status(500).send({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: null,
            data: null,
        });
    }
};

module.exports = {
    getProjects,
    getTripDetail,
    updateTrip,
    sendForApproval,
    rejectTrip,
    getApprovedTrips,
    approveTrip,
    getOthersTrips,
    getMyTrips,
    createTrip,
    loginUser,
    getUsers,
    addUser,
    updateUser,
    deleteUser
};
