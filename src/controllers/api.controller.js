// var nodemailer = require('nodemailer');
const mtmsMailer = require('../models/emailer.model');

// import Enumerable from 'linq'
const Enumerable = require('linq');

const User = require('../models/user.model');

const sns = require('../models/sns.model');

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
Trip.belongsTo(Project, { foreignKey: 'projectId', targetKey: 'projectId' });
Trip.belongsTo(Users, { foreignKey: 'userId', targetKey: 'userId' });
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
Group.belongsTo(ApproverGroup, { foreignKey: 'grp_id', targetKey: 'grp_id' });
ApproverGroup.belongsTo(Group, { foreignKey: 'grp_id', targetKey: 'grp_id' });


sequelize.authenticate().then(async () => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

const getUserDetail = async (req, res) => {
    var userId = req.query.userId;

    try {
        var userObj = (await Users.findOne({
            raw: true,
            attributes: ['userId', 'email', 'name', 'employeeCode', 'userType'],
            where: {
                userId: userId
            }
        }));

        if (userObj != null) {
            usrObj = {
                'userId': userObj.userId,
                'email': userObj.email
            };


            userObj.groups = (await ApproverGroup.findAll({
                raw: true,
                attributes: ['group.grp_name', 'group.grp_id'],
                include: [{
                    model: Group,
                    as: Group
                }],
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
        }
    } catch (e) {
        res.status(500).send({ statusCode: 500, statusMessage: 'Internal Server Error', message: null, data: null });
    }
}

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
            hotel_from_date: json["hotelFromDate"] != '' ? json["hotelFromDate"] : null,
            hotel_to_date: json["hotelToDate"] != '' ? json["hotelToDate"] : null,
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


//Cancel Trip for Trip Id.
const cancelTrip = async (req, res) => {
    var body = req.body;
    var json = JSON.parse(JSON.stringify(body));

    var tripId = parseInt(json["tripId"]);

    //Cancel Trip 
    await Trip.update({
        is_approved: 4
    },
        {
            where: {
                tripId: tripId
            }
        });

    //Make all approvals as 'Pending' after cancelling the trip.
    await GroupApproval.update({
        status: 0
    },
        {
            where: {
                trip_id: tripId
            }
        });

    try {
        res.send({
            statusCode: 200,
            statusMessage: 'Ok',
            message: 'Successfully retrieved all the users.',
            data: JSON.stringify(""),
        });
    } catch (e) {
        res.status(500).send({ statusCode: 500, statusMessage: 'Internal Server Error', message: null, data: null });
    }

}


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

        // var userGroups = await ApproverGroup.findAll({
        //     where: {
        //         user_id: userId
        //     }
        // });


        //Find the Group related to Project Id user has selected. Found group will be starting point of predefined approval 
        //Chain.
        var group = await Group.findOne({
            where: {
                project_id: parseInt(json["projectId"])
            }
        });

        var projectGrp = await ApproverGroup.findOne({
            where: {
                user_id: userId,
                grp_id: group.grp_id
            }
        });

        var approver;
        //If user is part of selected project group, find next approver
        if (projectGrp != null) {
            approver = await GroupApprover.findOne({
                where: {
                    from_grp_id: projectGrp.grp_id
                }
            });
        }
        else {
            //Find approver Id for 'System Group'(which is not defined as Group) & the group which user has selected to send the trip
            //to get approval.  
            approver = await GroupApprover.findOne({
                where: {
                    from_grp_id: 0,
                    to_grp_id: group.grp_id
                }
            });
        }

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
                status: 1 //Sent for approval
            });
        }
        else { //If approval is already created, then update existing approval (Rejection Case)
            var approval = await approval.update({
                status: 1 //Make it 'Sent for approval'
            });
        }

        //When 'Send For Approval' from user, change Trip Status to 'Sent'
        await Trip.update({
            is_approved: 1
        }, {
            where: {
                tripId: tripId
            }
        });


        //Send notification when, trip is sent for approval.
        sns.sendNotification({
            'mailer_id': { DataType: 'String', StringValue: 'send_for_approval' },
            'to_grp_id': { DataType: 'String', StringValue: approver.to_grp_id.toString() }
        });

        // mtmsMailer.sendForApprovalEmailer(1);

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


        if (nextApprover == null) { //If last approver, check for all approvals
            //Check if all approvals are approved for this trip.
            var notApprovedApprovals = await GroupApproval.findAll({
                where: {
                    trip_id: parseInt(json["tripId"]),
                    status: {
                        [Op.ne]: 2
                    }
                }
            });

            //If all approvals are 'Approved', Mark the Trip as Approved!
            if (notApprovedApprovals.length == 0) {
                await Trip.update({
                    is_approved: 2
                }, {
                    where: {
                        tripId: parseInt(json["tripId"])
                    }
                });
            }

            //When trip is finally approved.
            sns.sendNotification({
                'mailer_id': { DataType: 'String', StringValue: 'trip_approved' },
                'user_id': { DataType: 'String', StringValue: json["userId"] },
                'trip_id': { DataType: 'String', StringValue: json["tripId"] },
                'to_grp_id': { DataType: 'String', StringValue: tripApproval.grp_approver.to_grp_id.toString() }
            });

        }
        else { //If next approver exists in approval chain.
            //TODO: check if next approval already exists for this approver. only update status
            var nextApproval = await GroupApproval.findOne({
                require: true,
                where: {
                    grp_approver_id: nextApprover.grp_approver_id,
                    trip_id: parseInt(json["tripId"])
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
            } else { //Mark existing approval as 'SENT'
                await nextApproval.update({
                    status: 1
                });
            }

            //Mark Trip is 'SENT', when next approver group exists, and trip is yet to get approval.
            //Coz we have created approval yet, it means trip is 'Sent' to next group for approval.
            //So mark trip as 'Sent'.
            await Trip.update({
                is_approved: 1
            }, {
                where: {
                    tripId: parseInt(json["tripId"])
                }
            });

            
            //When trip is approved and sent to next approver.
            sns.sendNotification({
                'mailer_id': { DataType: 'String', StringValue: 'approve_trip' },
                'user_id': { DataType: 'String', StringValue: json["userId"] },
                'trip_id': { DataType: 'String', StringValue: json["tripId"] },
                'to_grp_id': { DataType: 'String', StringValue: tripApproval.grp_approver.to_grp_id.toString() },
                'next_apr_to_grp_id': { DataType: 'String', StringValue: nextApprover.to_grp_id.toString() },
            });

            // mtmsMailer.approveTripEmailer(tripApproval, nextApprover, parseInt(json["userId"]));

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

        //Reject Trip for current user's User Group.
        await GroupApproval.update({
            status: 3
        }, {
            where: {
                grp_approval_id: tripApproval.grp_approval_id //Approval for current User's User Group
            }
        });

        //Change approval status to not approved in Trip Table.
        await Trip.update({
            is_approved: 3
        }, {
            where: {
                tripId: parseInt(json["tripId"])
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

const deleteTrip = async (req, res) => {
    var body = req.body;
    var tripId = parseInt(body["tripId"]);

    try {

        await GroupApproval.destroy({
            where: {
                trip_id: tripId
            }
        });

        await Trip.destroy({
            where: {
                tripId: tripId
            }
        });

        res.send({
            statusCode: 200,
            statusMessage: 'Ok',
            message: 'Successfully retrieved all the users.',
            data: null,
        });
    } catch (e) {
        res.status(500).send({ statusCode: 500, statusMessage: 'Internal Server Error', message: err.message, data: null });
    }
}

const getUsers = async (req, res) => {
    try {

        var userType = parseInt(req.query.userType);
        var users;
        if (userType != -1)
            users = await Users.findAll({
                raw: true,
                where: {
                    userType: userType
                }
            });
        else
            users = await Users.findAll();

        //const users = await User.find();

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

const getApproverUsers = async (req, res) => {
    try {
        var groupId = req.query.groupId;

        var users = await Users.findAll({
            include: [{
                model: ApproverGroup,
                as: ApproverGroup,
                where: {
                    grp_id: groupId
                }
            }]
        });

        res.send({
            statusCode: 200,
            statusMessage: 'Ok',
            message: 'Successfully retrieved all the users.',
            data: JSON.stringify(users),
        });

    } catch (e) {
        res.status(500).send({ statusCode: 500, statusMessage: 'Internal Server Error', message: null, data: null });
    }
}

const getUserGroups = async (req, res) => {

    var userId = req.query.userId;

    try {

        var groups;

        if (userId == -1) {
            groups = await Group.findAll();
        }
        else {
            groups = await Group.findAll({
                raw: true,
                attributes: ['grp_name', 'grp_id', 'grp_type', 'project_id'],
                include: [{
                    model: ApproverGroup,
                    as: ApproverGroup,
                    where: {
                        user_id: userId
                    }
                }]
            })
        }

        res.send({
            statusCode: 200,
            statusMessage: 'Ok',
            message: 'Successfully retrieved all the users.',
            data: JSON.stringify(groups),
        });
    }
    catch (e) {
        res.status(500).send({ statusCode: 500, statusMessage: 'Internal Server Error', message: null, data: null });
    }
}

const loginUser = async (req, res) => {
    try {
        var status = 0;
        var body = req.body;
        var json = JSON.parse(JSON.stringify(body));


        var userObj = (await Users.findOne({
            raw: true,
            attributes: ['userId', 'email', 'name', 'employeeCode', 'userType'],
            where: {
                email: json["email"]
            }
        }));

        if (userObj != null) {
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
        }
        else {
            res.status(401).send({
                message: 'This is an error!'
            });
        }

    } catch (err) {
        res.status(500).send({ statusCode: 500, statusMessage: 'Internal Server Error', message: null, data: null });
    }
}

const addUser = async (req, res) => {
    var body = req.body;
    var json = JSON.parse(JSON.stringify(body));
    var groups = json["groups"];
    var action = json["action"];

    if (groups != "")
        groups = groups.split(",");

    try {

        var user = await Users.findOne({
            where: {
                email: json["email"]
            }
        });

        if (user == null && action == 0) {

            var result = await Users.create({
                name: json["name"],
                email: json["email"],
                employeeCode: json["employeeCode"],
                userType: parseInt(json["userType"])
            })

            var grp_user_map = [];
            for (var i = 0; i < groups.length; i++) {
                grp_user_map[i] = { user_id: result.userId, grp_id: parseInt(groups[i]) };
            }

            await ApproverGroup.bulkCreate(grp_user_map);

            res.status(201).send({
                statusCode: 201,
                statusMessage: 'Created',
                message: 'Successfully created a user.',
                data: null,
            });
        }
        else if (user != null && action == 1) { //If user exists and update user.
            await Users.update({
                name: json["name"],
                email: json["email"],
                employeeCode: json["employeeCode"],
                userType: parseInt(json["userType"])
            }, {
                where: {
                    email: json["email"]
                }
            });

            for (var i = 0; i < groups.length; i++) {
                var userGrp = await ApproverGroup.findOne({
                    where: {
                        user_id: user.userId,
                        grp_id: parseInt(groups[i])
                    }
                });

                if (userGrp == null) {
                    await ApproverGroup.create({
                        user_id: user.userId,
                        grp_id: parseInt(groups[i])
                    })
                }
            }


            var dbUserGrps = await ApproverGroup.findAll({
                where: {
                    user_id: user.userId
                }
            });

            for (var j = 0; j < dbUserGrps.length; j++) {
                var exists = false;
                for (var i = 0; i < groups.length; i++) {
                    if (dbUserGrps[j].user_id == user.userId && dbUserGrps[j].grp_id == groups[i]) {
                        exists = true;
                        break;
                    }
                }

                if (!exists) {
                    await ApproverGroup.destroy({
                        where: {
                            user_id: user.userId,
                            grp_id: dbUserGrps[j].grp_id,
                        }
                    })
                }
            }

            res.status(200).send({
                statusCode: 200,
                statusMessage: 'Created',
                message: 'User already created!',
                data: null,
            });
        }
        else {
            res.status(400).send({
                statusCode: 201,
                statusMessage: 'Created',
                message: 'User already created!',
                data: null,
            });
        }
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

// function sendEmail() {
//     var transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: 'atul.net1987@gmail.com',
//             pass: 'zeuzkwivgtfmslrm'
//         }
//     });

//     var mailOptions = {
//         from: 'atul.net1987@gmail.com',
//         to: 'atul.net@live.com',
//         subject: 'Sending Email using Node.js',
//         text: 'That was easy!'
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log('Email sent: ' + info.response);
//         }
//     });
// }

const getOthersTripsGroup = async (req, res) => {
    var userId = req.query.userId;

    // sendEmail();

    try {

        var trips = [];
        const tripsData = await ApproverGroup.findAll({
            // raw: true,
            require: true,
            attributes: [[sequelize.col('ToGroupApprovers.ToGroup.grp_name'), 'Group Name'],
            // [sequelize.col('ToGroupApprovers.grp_approval.trip.project.project_name'), 'projectName'],
            [sequelize.col('ToGroupApprovers.grp_approval.trip.name'), 'name'],
            [sequelize.col('ToGroupApprovers.grp_approval.trip.tripId'), 'tripId'],
            [sequelize.col('ToGroupApprovers.grp_approval.trip.is_approved'), 'is_approved'],
                'user_id',
            [sequelize.col('ToGroupApprovers.ToGroup.project_id'), 'ProjectId']],
            include: [{
                model: GroupApprover,
                as: 'ToGroupApprovers',
                require: true,
                // attributes: [],
                include: [{
                    model: GroupApproval,
                    as: GroupApproval,
                    require: true,
                    // attributes: [],
                    include: [{
                        model: Trip,
                        as: Trip,
                        required: true,
                        // attributes: []
                        include: [{
                            model: Project,
                            as: Project
                        }, {
                            model: Users,
                            as: Users
                        }]
                    }]
                }, {
                    model: Group,
                    as: 'ToGroup',
                    require: true,
                    // attributes: [],
                    include: [{
                        model: Project,
                        as: Project,
                        require: true,
                        // attributes: []
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
            var tripObject = getTripObject(tripsData[i].ToGroupApprovers.grp_approval.trip);
            tripObject.approvals = await Trip.findAll({
                raw: true,
                attributes: ['name', 'is_approved',
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
                    tripId: tripsData[i].ToGroupApprovers.grp_approval.trip.tripId
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
        projectId: trip.projectId,
        isApproved: trip.is_approved,
        projectName: trip.project != null ? trip.project.project_name : "",
        name: trip.user != null ? trip.user.name : ""
    };
}

const getApprovers = async (req, res) => {
    try {

        var projectId = parseInt(req.query.project_id); //Group Id belongs to project id.

        var projectGrpId = await Group.findOne({
            where: {
                project_id: projectId
            }
        });

        var approvers = await GroupApprover.findAll();
        var data = []; //Array to store project approver's chain. (Project Name + Project Approver chain).

        var projIndex = 0; //counter for all projects.
        for (var i = 0; i < approvers.length; i++) { //Iterate all approvers
            var to_grp_id = approvers[i].to_grp_id; //get Approver's To Group Id

            //if approver is from Project group. Starting point for approver chain.
            if (approvers[i].from_grp_type == 0 && (projectId == -1 || to_grp_id == projectGrpId.grp_id)) { //If From Group is User's Group (System Group, trip request is coming from User Group), 
                var projApprover; //variable for next approver group for current approver group.
                var index = 0; //Counter for project approver's array.
                data[projIndex] = { 'proj_grp_id': to_grp_id }; //Get project group Id/.
                data[projIndex].approvers = []; //Project approvers.
                do {
                    projApprover = await GroupApprover.findOne({ //Find approver for current (From Group) group.
                        // raw: true,
                        include: [{
                            model: Group,
                            as: 'ToGroup'
                        }, {
                            model: Group,
                            as: 'FromGroup'
                        }],
                        where: {
                            from_grp_id: to_grp_id
                        }
                    });

                    if (projApprover != null) { //If approver found for current group, create approver object.
                        to_grp_id = projApprover.to_grp_id;
                        data[projIndex].approvers[index++] = {
                            'from_grp_id': projApprover.from_grp_id,
                            'to_grp_id': projApprover.to_grp_id,
                            'from_grp_name': projApprover.FromGroup.grp_name,
                            'to_grp_name': projApprover.ToGroup.grp_name
                        };
                    }

                } while (projApprover != null); //Run untill next approver group is available for current approver group.

                projIndex++; //for project array.
            }


        }

        res.status(200).send({
            statusCode: 201,
            statusMessage: 'Created',
            message: 'Successfully created a user.',
            data: JSON.stringify(data),
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

const subcriptionEndpoint = async (req, res) => {
    try {
        let payload = JSON.parse(req.body);

        console.log(payload);
        res.status(200).send({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: null,
            data: payload,
        });
    }
    catch (e) {
        console.log("Internal Server Error");
        res.status(500).send({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: null,
            data: payload,
        });
    }
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
            include: [{
                model: Project,
                as: Project
            }],
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
};

const getTripsByStatus = async (req, res) => {
    var userId = req.query.userId;
    var status = parseInt(req.query.status);

    try {

        var trips = [];
        var index = 0;

        if (status == -1) { //Get All Trips but which are not pending.
            await Trip.findAll({
                // raw: true,
                include: [{
                    model: Project,
                    as: Project
                }],
                where: {
                    is_approved: {
                        [Op.ne]: 0
                    }
                }
            }).then(async (list) => {
                await Promise.all(list.map(async (trip) => trips[index++] = (await getTripApprovals(getTripObject(trip)))));
            });
        }
        else {
            await Trip.findAll({
                // raw: true,
                include: [{
                    model: Project,
                    as: Project
                }],
                where: {
                    is_approved: status
                }
            }).then(async (list) => {
                await Promise.all(list.map(async (trip) => trips[index++] = (await getTripApprovals(getTripObject(trip)))));
                // list.map(async (trip) => trips[index++] = (await getTripApprovals(getTripObject(trip))));
            });
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

const getTripApprovals = async (tripObject) => {
    var trip = tripObject;

    trip.approvals = await GroupApproval.findAll({
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
            trip_id: trip.tripId
        }
    });

    return trip;
}

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
    const userId = req.params.userId;

    try {

        await Users.destroy({
            where: {
                userId: parseInt(userId)
            }
        });

        await ApproverGroup.destroy({
            where: {
                user_id: parseInt(userId)
            }
        });

        //await User.findByIdAndDelete(id);

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
    subcriptionEndpoint,
    deleteTrip,
    getApproverUsers,
    getApprovers,
    getProjects,
    getTripDetail,
    updateTrip,
    sendForApproval,
    rejectTrip,
    getTripsByStatus,
    approveTrip,
    getOthersTrips,
    getOthersTripsGroup,
    getMyTrips,
    getMyTripsGroup,
    createTrip,
    loginUser,
    getUsers,
    getUserDetail,
    addUser,
    updateUser,
    deleteUser,
    cancelTrip,
    getUserGroups
};
