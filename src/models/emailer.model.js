var nodemailer = require('nodemailer');
const { ApproverGroup } = require('../databases/models/approvers_to_grp_map.model');
const User = require('./user.model');
const { Users } = require('../databases/models/dbmodels');
const { Group } = require('../databases/models/group.model');
const { Trip } = require('../databases/models/trip.model');
const sns = require('../models/sns.model');

const mailer_id = "";
const serverUrl = "https://mtmsweb.s3-website-us-east-1.amazonaws.com";

// const { SNSClient, AddPermissionCommand } = require("@aws-sdk/client-sns");
// const { SNSClient } = require("aws-sdk");
// var AWS = require('aws-sdk');
// AWS.config.update({
//     region: 'us-east-1', credentials: {
//         accessKeyId: 'AKIA3BRJRF4XNPIFXBWD',
//         secretAccessKey: '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'
//     }
// });

ApproverGroup.belongsTo(Users, { foreignKey: 'user_id', targetKey: 'userId' });

const sendForApprovalEmailer = async (to_grp_id, trip_id) => {

    var html = "<body><h3>You have a <a href='" + serverUrl + "/tripdetail?tripId=" + trip_id + "'>" + "MET-" + trip_id + "</a> to approve.</h3></body>";
    var users = await ApproverGroup.findAll({ //Send email to all approvers in the group.
        include: [{
            model: Users,
            as: Users
        }],
        where: {
            grp_id: to_grp_id
        }
    });

    console.log("users length: " + users.length);



    // var jsonUsers = {
    //     html: html
    // };
    // var usersArray = [];
    // for (var i = 0; i < usersArray.length; i++)
    //     usersArray[i] = usersArray[i].user.email;

    // jsonUsers.users = usersArray;

    //sns.sendNotification({ 'emailBody': { DataType: 'String', StringValue: JSON.stringify(jsonUsers) } });

    for (var i = 0; i < users.length; i++)
        sendEmail(users[i].user.email, "Trip Request Raised!: " + users[i].user.email, html);


    // MessageAttributes: {
    //     'email': { DataType: 'String', StringValue: 'atul.net@live.com' },
    //     'name': { DataType: 'String', StringValue: 'Arun Govil' },
    // }



    // var jsonAdminUsers = {
    //     html: html
    // };
    // var adminUsersArray = [];

    // //Send email to admin users
    var adminUsers = await Users.findAll({
        where: {
            userType: 1
        }
    });

    for (var i = 0; i < adminUsers.length; i++)
        sendEmail(users[i].user.email, "Trip Request Raised!: " + users[i].user.email, html);


    // adminUsersArray[i] = users[i].user.email;

    // jsonAdminUsers.users = adminUsersArray;
    // sns.sendNotification({ 'emailBody': { DataType: 'String', StringValue: JSON.stringify(jsonAdminUsers) } });

    // sendEmail(users[i].user.email, "Trip Request Raised!: " + users[i].user.email, html);

}

const tripApprovedEmailer = async (trip_id, to_grp_id, next_apr_to_grp_id, user_id) => {
    try {
        var trip = await Trip.findOne({
            where: {
                tripId: trip_id
            }
        });



        console.log("name: " + JSON.stringify(trip));

        var tripUser = await Users.findOne({
            where: {
                userId: user_id
            }
        });

        //Send email to admin users
        var adminUsers = await Users.findAll({
            where: {
                userType: 1
            }
        });

        var approvedByUser = await Users.findOne({
            where: {
                userId: user_id
            }
        });

        var approvedFromGroup = await Group.findOne({
            where: {
                grp_id: to_grp_id
            }
        });

        var html = "<body><h3>Your trip <a href='" + serverUrl + "/tripdetail?tripId=" + trip.tripId + "'>" + "MET-" + trip.tripId + "</a> is approved by " + approvedByUser.name + " </h3><p>Trip is approved from " + approvedFromGroup.grp_name + ".</p></body>";

        //Send email to all admin users.
        for (var i = 0; i < adminUsers.length; i++)
            sendEmail(adminUsers[i].email, trip.name + " Trip is Approved!: " + adminUsers[i].email, html);

        //Send email to user whose trip is approved and sent.
        sendEmail(tripUser.email, tripUser.name + " You Trip is Approved!: " + tripUser.email, html);

        //Send email to all users of the group(which approved the trip).
        var approvedByGroupUsers = await ApproverGroup.findAll({
            include: [{
                model: Users,
                as: Users
            }],
            where: {
                grp_id: approvedFromGroup.grp_id
            }
        });

        for (var i = 0; i < approvedByGroupUsers.length; i++)
            sendEmail(approvedByGroupUsers[i].user.email, trip.name + " Trip is Approved!: " + approvedByGroupUsers[i].user.email, html);

        //Send email to all the users of the group(Trip is sent to which group).
        var sendToGroupUsers = await ApproverGroup.findAll({
            include: [{
                model: Users,
                as: Users
            }],
            where: {
                grp_id: sentToGroup.grp_id
            }
        });

        for (var i = 0; i < sendToGroupUsers.length; i++)
            sendEmail(sendToGroupUsers[i].user.email, trip.name + " Trip is Approved!: " + sendToGroupUsers[i].user.email, html);

    }
    catch (e) {
        console.log(e.message);
    }
}

//tripApproval: Get group who approved the trip.
//nextApprover: get group who has been sent the trip.
//userId: User whose trip is approved and sent.
const approveTripEmailer = async (trip_id, to_grp_id, next_apr_to_grp_id, user_id) => {

    try {
        var trip = await Trip.findOne({
            where: {
                tripId: trip_id
            }
        });



        console.log("name: " + JSON.stringify(trip));

        var tripUser = await Users.findOne({
            where: {
                userId: user_id
            }
        });

        //Send email to admin users
        var adminUsers = await Users.findAll({
            where: {
                userType: 1
            }
        });

        var approvedByUser = await Users.findOne({
            where: {
                userId: user_id
            }
        });

        var approvedFromGroup = await Group.findOne({
            where: {
                grp_id: to_grp_id
            }
        });

        var sentToGroup = await Group.findOne({
            where: {
                grp_id: next_apr_to_grp_id
            }
        });

        var html = "<body><h3>Your trip " + trip.name + " is approved by " + approvedByUser.name + " </h3><p>Trip is sent from " + approvedFromGroup.grp_name + " to " + sentToGroup.grp_name + " </p></body>";

        //Send email to all admin users.
        for (var i = 0; i < adminUsers.length; i++)
            sendEmail(adminUsers[i].email, trip.name + " Trip is Approved!: " + adminUsers[i].email, html);

        //Send email to user whose trip is approved and sent.
        sendEmail(tripUser.email, tripUser.name + " You Trip is Approved!: " + tripUser.email, html);

        //Send email to all users of the group(which approved the trip).
        var approvedByGroupUsers = await ApproverGroup.findAll({
            include: [{
                model: Users,
                as: Users
            }],
            where: {
                grp_id: approvedFromGroup.grp_id
            }
        });

        for (var i = 0; i < approvedByGroupUsers.length; i++)
            sendEmail(approvedByGroupUsers[i].user.email, trip.name + " Trip is Approved!: " + approvedByGroupUsers[i].user.email, html);

        //Send email to all the users of the group(Trip is sent to which group).
        var sendToGroupUsers = await ApproverGroup.findAll({
            include: [{
                model: Users,
                as: Users
            }],
            where: {
                grp_id: sentToGroup.grp_id
            }
        });

        for (var i = 0; i < sendToGroupUsers.length; i++)
            sendEmail(sendToGroupUsers[i].user.email, trip.name + " Trip is Approved!: " + sendToGroupUsers[i].user.email, html);

    }
    catch (e) {
        console.log(e.message);
    }
}

function sendEmail(userEmail, subject, html) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'atul.net1987@gmail.com',
            pass: 'zeuzkwivgtfmslrm'
        }
    });

    var mailOptions = {
        from: 'atul.net1987@gmail.com',
        to: 'atul.net@live.com',
        subject: subject,
        text: 'That was easy!',
        html: html
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

const handleSNSMessage = async function (req, resp, next) {

    try {
        let payloadStr = req.body;
        payload = JSON.parse(JSON.stringify(payloadStr));
        console.log(payload);

        if (req.header('x-amz-sns-message-type') === 'SubscriptionConfirmation') {
            const url = payload.SubscribeURL;
            console.log("Subscription Url for Endpoint: " + url);
        } else if (req.header('x-amz-sns-message-type') === 'Notification') {
            var attrs = JSON.parse(JSON.parse(JSON.stringify(payload))).MessageAttributes;

            switch (attrs.mailer_id.Value) {
                case "send_for_approval":
                    console.log("attrs.to_grp_id: " + attrs.to_grp_id.Value);
                    sendForApprovalEmailer(parseInt(attrs.to_grp_id.Value), parseInt(attrs.trip_id.Value));
                    break;

                case "approve_trip":
                    console.log("Mailer Id: " + "approve trip");
                    console.log("attrs.user_id: " + attrs.trip_id.Value);
                    approveTripEmailer(parseInt(attrs.trip_id.Value), parseInt(attrs.to_grp_id.Value), parseInt(attrs.next_apr_to_grp_id.Value), parseInt(attrs.user_id.Value));
                    break;

                case "trip_approved":
                    tripApprovedEmailer(parseInt(attrs.trip_id.Value), parseInt(attrs.to_grp_id.Value), parseInt(attrs.next_apr_to_grp_id.Value), parseInt(attrs.user_id.Value));
                    break;
            }

            // console.log(attrs.email.Value);
            // console.log(attrs.name.Value);
        } else {
            throw new Error(`Invalid message type ${payload.Type}`);
        }
    } catch (err) {
        console.error(err)
        resp.status(500).send('Oops')
    }
    resp.send('Ok')
}

module.exports = {
    sendForApprovalEmailer,
    approveTripEmailer,
    handleSNSMessage
};