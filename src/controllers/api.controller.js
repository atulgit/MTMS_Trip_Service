
// import Enumerable from 'linq'
const Enumerable = require('linq');

const User = require('../models/user.model');

// const db = require('../databases/models/UserModel');

const { sequelize } = require('../databases/dbconnection');
const { Users } = require('../databases/models/dbmodels');
const { Trip } = require('../databases/models/trip.model');
const { GroupApprover } = require('../databases/models/grp_approver.model');
const { GroupApproval } = require('../databases/models/grp_approval.model');
const { ApproverGroup } = require('../databases/models/approvers_to_grp_map.model');
const { Group } = require('../databases/models/group.model');
const { raw } = require('express');
const { Project } = require('../databases/models/project.model');
const { Op } = require('sequelize');

Trip.belongsTo(GroupApproval, { foreignKey: 'tripId', targetKey: 'trip_id' });
GroupApproval.belongsTo(GroupApprover, { foreignKey: 'grp_approver_id', targetKey: 'grp_approver_id' });
GroupApprover.belongsTo(Group, { as: 'FromGroup', foreignKey: 'from_grp_id', targetKey: 'grp_id' });
GroupApprover.belongsTo(Group, { as: 'ToGroup', foreignKey: 'to_grp_id', targetKey: 'grp_id' });
GroupApproval.belongsTo(Trip, { foreignKey: 'trip_id', targetKey: 'tripId' });
GroupApprover.belongsTo(GroupApproval, { foreignKey: 'grp_approver_id', targetKey: 'grp_approver_id' });
ApproverGroup.belongsTo(GroupApprover, { as: 'ToGroupApprovers', foreignKey: 'grp_id', targetKey: 'to_grp_id' });
ApproverGroup.belongsTo(GroupApprover, { as: 'FromGroupApprovers', foreignKey: 'grp_id', targetKey: 'from_grp_id' });
Group.belongsTo(Project, { foreignKey: 'project_id', targetKey: 'projectId' });
Users.belongsTo(ApproverGroup, { foreignKey: 'userId', targetKey: 'user_id' });
GroupApprover.belongsTo(ApproverGroup, { foreignKey: 'to_grp_id', targetKey: 'grp_id' });


sequelize.authenticate().then(async () => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});


const createTrip = async (req, res) => {
    var body = req.body;
    var json = JSON.parse(JSON.stringify(body));

    try {
        var tripObj = await Trip.create({
            name: json["name"],
            userId: parseInt(json["userId"]),
            projectId: parseInt(json["projectId"]),
            reason: json["reason"],
            travel_mode: parseInt(json["travelMode"]),
            startDate: json["startDate"],
            endDate: json["endDate"],
            hotel_from_date: json["hotelFromDate"],
            hotel_to_date: json["hotelToDate"],
            from_country: json["fromCountry"],
            from_city: json["fromCity"],
            to_country: json["toCountry"],
            to_city: json["toCity"]
        });

        // var group = await Group.findOne({
        //     where: {
        //         project_id: parseInt(json["projectId"])
        //     }
        // });

        // var approver = await GroupApprover.findOne({
        //     where: {
        //         from_grp_id: 0,
        //         to_grp_id: group.grp_id
        //     }
        // });


        // var approval = await GroupApproval.create({
        //     trip_id: tripObj.tripId,
        //     grp_approver_id: approver.grp_approver_id,
        //     approver_user_id: parseInt(json["userId"]),
        //     status: 0
        // });

        res.send({
            statusCode: 200,
            statusMessage: 'Ok',
            message: 'Successfully retrieved all the users.',
            data: JSON.stringify(getTripObject(tripObj)),
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

//This method is only used when trip is created by someone. After creating the trip, it needs to send to particular Project group
//to get approval. Here user is selecting the Project(Group) to which user needs to send this Trip.
//The trip is not bound to any specific project or group initially. User has to select the Project(Group).
//After the Trip is sent to specfic Project(Group), then this will fall into predefined approval chain.
const sendForApproval = async (req, res) => {
    var body = req.body;
    var json = JSON.parse(JSON.stringify(body));
    var projectId = parseInt(json["projectId"]);
    var tripId = parseInt(json["tripId"]);
    var userId = parseInt(json["userId"]);

    try {

        //Find the Group related to Project Id user has selected. Found group will be starting point of predefined approval 
        //Chain.
        var group = await Group.findOne({
            where: {
                project_id: parseInt(json["projectId"])
            }
        });

        //Find approver Id for 'System Group'(which is not defined as Group) & the group which user has selected to send the trip
        //to get approval.  
        var approver = await GroupApprover.findOne({
            where: {
                from_grp_id: 0,
                to_grp_id: group.grp_id
            }
        });

        //Get the Approval for this particular approver Id for particular trip Id
        var approval = await GroupApproval.findOne({
            where: {
                trip_id: tripId,
                grp_approver_id: approver.grp_approver_id
            }
        });


        //TODO: 
        //set all approvals status to '0' first. In case, approvals are already exists and rejected by some group.
        //Setting '0' means, approval needs to send again to get approved. '0' status approval will be visible to all, but can't be 
        //approved until status is '1'('Sent'). 

        await GroupApproval.update({
            status: 0
        }, {
            where: {
                trip_id: tripId
            }
        })

        //If approval for this Trip and Approver is not created yet.
        if (approval == null) {
            await GroupApproval.create({
                trip_id: tripId,
                grp_approver_id: approver.grp_approver_id,
                approver_user_id: parseInt(json["userId"]),
                status: 1
            });
        }
        else { //If approval is already created, then update existing approval (Rejection Case)
            var approval = await approval.update({
                status: 1
            });
        }

        res.send({
            statusCode: 200,
            statusMessage: 'Ok',
            message: 'Successfully retrieved all the users.',
            data: JSON.stringify(approval),
        });
    } catch (err) {
        res.status(500).send({ statusCode: 500, statusMessage: 'Internal Server Error', message: null, data: null });
    }
};

const approveTrip = async (req, res) => {
    var body = req.body;
    var json = JSON.parse(JSON.stringify(body));

    try {

        //Find the trip approval for this Trip & User Group (To whom this trip is assigned).
        var tripApproval = await GroupApproval.findOne({ //Find approval for this user group
            // raw: true,
            require: true,
            include: [{ // Find approver for this Approval and find group to which this trip is assigned.
                model: GroupApprover,
                as: GroupApprover,
                required: true,
                // attributes: [],
                include: [{ //Find User for the group, to which group this trip is assigned.
                    model: ApproverGroup,
                    as: ApproverGroup,
                    required: true,
                    // attributes: [],
                    where: {
                        user_id: parseInt(json["userId"])
                    }
                }],
            }],
            where: {
                trip_id: parseInt(json["tripId"])
            }
        });

        //Approve Trip for current user's User Group.
        await GroupApproval.update({
            status: 2
        }, {
            where: {
                grp_approval_id: tripApproval.grp_approval_id //Approval for current User's User Group
            }
        });

        //Find next approval group, using current approval group as From group.
        var nextApprover = await GroupApprover.findOne({
            where: {
                from_grp_id: tripApproval.grp_approver.to_grp_id //Next Group for current user Group
            }
        });

        //TODO: check if next approval already exists for this approver. only update status
        var nextApproval = await GroupApproval.findOne({
            where: {
                grp_approver_id: nextApprover.grp_approver_id
            }
        });


        if (nextApproval == null) {
            //Create next approval and send for approval.
            await GroupApproval.create({
                trip_id: parseInt(json["tripId"]),
                grp_approver_id: nextApprover.grp_approver_id,
                approver_user_id: parseInt(json["userId"]),
                status: 1
            });
        } else {
            await nextApproval.update({
                status: 1
            });
        }

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
        // const result = await User.rejectTrip(parseInt(json["tripId"]), parseInt(json["approverId"]), parseInt(json["userId"]));

        //Find the trip approval for this Trip & User Group (To whom this trip is assigned).
        var tripApproval = await GroupApproval.findOne({ //Find approval for this user group
            // raw: true,
            require: true,
            include: [{ // Find approver for this Approval and find group to which this trip is assigned.
                model: GroupApprover,
                as: GroupApprover,
                required: true,
                // attributes: [],
                include: [{ //Find User for the group, to which group this trip is assigned.
                    model: ApproverGroup,
                    as: ApproverGroup,
                    required: true,
                    // attributes: [],
                    where: {
                        user_id: parseInt(json["userId"])
                    }
                }],
            }],
            where: {
                trip_id: parseInt(json["tripId"])
            }
        });

        //Approve Trip for current user's User Group.
        await GroupApproval.update({
            status: 3
        }, {
            where: {
                grp_approval_id: tripApproval.grp_approval_id //Approval for current User's User Group
            }
        });


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
        res.status(500).send({ statusCode: 500, statusMessage: 'Internal Server Error', message: err.message, data: null });
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


        var usrObj = {};


        var userObj = (await Users.findOne({
            raw: true,
            attributes: ['userId', 'email', 'userName', 'employeeCode', 'userType'],
            where: {
                email: json["email"]
            }
        }));

        usrObj = {
            'userId': userObj.userId,
            'email': userObj.email
        };

        userObj.groups = (await ApproverGroup.findAll({
            raw: true,
            where: {
                user_id: userObj.userId
            }
        }));

        res.send({
            statusCode: 200,
            statusMessage: 'Ok',
            message: 'Successfully retrieved all the users.',
            data: JSON.stringify(userObj),
        });
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

const getOthersTripsGroup = async (req, res) => {
    var userId = req.query.userId;

    try {


        var trips = [];
        const tripsData = await ApproverGroup.findAll({
            raw: true,
            require: true,
            attributes: [[sequelize.col('ToGroupApprovers.ToGroup.grp_name'), 'Group Name'],
            [sequelize.col('ToGroupApprovers.ToGroup.project.project_name'), 'Project Name'],
            [sequelize.col('ToGroupApprovers.grp_approval.trip.name'), 'name'],
            [sequelize.col('ToGroupApprovers.grp_approval.trip.tripId'), 'tripId'],
                'user_id',
            [sequelize.col('ToGroupApprovers.ToGroup.project_id'), 'ProjectId']],
            include: [{
                model: GroupApprover,
                as: 'ToGroupApprovers',
                require: true,
                attributes: [],
                include: [{
                    model: GroupApproval,
                    as: GroupApproval,
                    require: true,
                    attributes: [],
                    include: [{
                        model: Trip,
                        as: Trip,
                        required: true,
                        attributes: []
                    }]
                }, {
                    model: Group,
                    as: 'ToGroup',
                    require: true,
                    attributes: [],
                    include: [{
                        model: Project,
                        as: Project,
                        require: true,
                        attributes: []
                    }]
                }]
            }],
            where: {
                user_id: userId,
                '$ToGroupApprovers.grp_approval.trip.tripId$': {
                    [Op.ne]: null
                }

            }
        });

        var index = 0;
        for (var i = 0; i < tripsData.length; i++) {
            var tripObject = getTripObject(tripsData[i]);
            tripObject.approvals = await Trip.findAll({
                raw: true,
                attributes: ['name',
                    [sequelize.col('grp_approval.grp_approver.to_grp_id'), 'to_grp_id'],
                    [sequelize.col('grp_approval.grp_approver.from_grp_id'), 'from_grp_id'],
                    [sequelize.col('grp_approval.grp_approver.FromGroup.grp_name'), 'FromGrpName'],
                    [sequelize.col('grp_approval.grp_approver.ToGroup.grp_name'), 'ToGrpName'],
                    [sequelize.col('grp_approval.status'), 'isApproved']],

                include: [{
                    model: GroupApproval,
                    as: GroupApproval,
                    attributes: [],
                    include: [{
                        model: GroupApprover,
                        as: GroupApprover,
                        attributes: [],
                        include: [{
                            model: Group,
                            as: 'FromGroup',
                            attributes: []
                        },
                        {
                            model: Group,
                            as: 'ToGroup',
                            attributes: []
                        }]
                    }]
                }],
                where: {
                    tripId: tripsData[i].tripId
                }
            });
            trips[index++] = tripObject;
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

        var trip = await Trip.findOne({
            where: {
                tripId: tripId
            }
        });

        var tripObject = getTripObject(trip);

        tripObject.approvals = await GroupApproval.findAll({
            raw: true,
            attributes: ['trip_id',
                ['status', 'isApproved'],
                'grp_approver.from_grp_id',
                'grp_approver.to_grp_id',
                [sequelize.col('grp_approver.ToGroup.grp_name'), 'ToGrpName'],
                [sequelize.col('grp_approver.FromGroup.grp_name'), 'FromGrpName'],
                [sequelize.col('grp_approver.ToGroup.project_id'), 'ProjectId']], //'grp_approver.ToGroup.grp_name', 'grp_approver.FromGroup.grp_name'
            include: [{
                model: GroupApprover,
                as: GroupApprover,
                attributes: [],
                include: [{
                    model: Group,
                    as: 'FromGroup',
                    attributes: [],
                }, {
                    model: Group,
                    as: 'ToGroup',
                    attributes: []
                }]
            }],
            where: {
                trip_id: tripId
            }
        })


        // var result = await User.getTripDetail(tripId);
        // var tripDetail;

        // var current_id;
        // var index = 0;


        // for (var i = 0; i < result.length; i++) {
        //     var trip = result[i];
        //     if (current_id != trip.tripId) { //if current trip is new trip
        //         var tripApprovals = result.filter(function filterApprovals(trp) {
        //             if (trp.tripId == trip.tripId) return true;
        //         });
        //         var nonApprovals = tripApprovals.filter(function nonApprovalsFilter(apr) {
        //             if (apr.isAprooved != 2) return true;
        //         });
        //         var isTripApproved = nonApprovals.length > 0 ? 0 : 2;
        //         tripDetail = getTripObject(trip);
        //         tripDetail.isApproved = isTripApproved;
        //         tripDetail.approvals = tripApprovals;
        //     }
        //     else {

        //     }

        //     current_id = trip.tripId;

        // }

        res.status(200).send({
            statusCode: 201,
            statusMessage: 'Created',
            message: 'Successfully created a user.',
            data: JSON.stringify(tripObject),
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

    var data = await Users.findAll({
        where: {
            userId: 30
        }
    });

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

const getMyTripsGroup = async (req, res) => {
    var userId = req.query.userId;

    try {

        var trips = [];
        const tripsData = await Trip.findAll({
            where: {
                userId: userId
            }
        });

        var index = 0;
        for (var i = 0; i < tripsData.length; i++) {
            var tripObject = getTripObject(tripsData[i]);

            tripObject.approvals = await GroupApproval.findAll({
                raw: true,
                attributes: ['trip_id',
                    ['status', 'isApproved'],
                    'grp_approver.from_grp_id',
                    'grp_approver.to_grp_id',
                    [sequelize.col('grp_approver.ToGroup.grp_name'), 'ToGrpName'],
                    [sequelize.col('grp_approver.FromGroup.grp_name'), 'FromGrpName'],
                    [sequelize.col('grp_approver.ToGroup.project_id'), 'ProjectId']], //'grp_approver.ToGroup.grp_name', 'grp_approver.FromGroup.grp_name'
                include: [{
                    model: GroupApprover,
                    as: GroupApprover,
                    attributes: [],
                    include: [{
                        model: Group,
                        as: 'FromGroup',
                        attributes: [],
                    }, {
                        model: Group,
                        as: 'ToGroup',
                        attributes: []
                    }]
                }],
                where: {
                    trip_id: tripsData[i].tripId
                }
            })
            trips[index++] = tripObject;
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
    getOthersTripsGroup,
    getMyTrips,
    getMyTripsGroup,
    createTrip,
    loginUser,
    getUsers,
    addUser,
    updateUser,
    deleteUser
};
