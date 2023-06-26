var nodemailer = require('nodemailer');
const { ApproverGroup } = require('../databases/models/approvers_to_grp_map.model');
const User = require('./user.model');
const { Users } = require('../databases/models/dbmodels');
const { Group } = require('../databases/models/group.model');
const { Trip } = require('../databases/models/trip.model');

// const { SNSClient, AddPermissionCommand } = require("@aws-sdk/client-sns");
// const { SNSClient } = require("aws-sdk");
var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1', credentials: {
        accessKeyId: 'AKIA3BRJRF4XNPIFXBWD', 
        secretAccessKey: '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'
    }
});

ApproverGroup.belongsTo(Users, { foreignKey: 'user_id', targetKey: 'userId' });

const sendForApprovalEmailer = async (approver) => {

    var html = "<body><h3>You have a trip request to approve.</h3></body>";
    var users = await ApproverGroup.findAll({ //Send email to all approvers in the group.
        include: [{
            model: Users,
            as: Users
        }],
        where: {
            grp_id: approver.to_grp_id
        }
    });

    for (var i = 0; i < users.length; i++)
        sendEmail(users[i].user.email, "Trip Request Raised!: " + users[i].user.email, html);

    //Send email to admin users
    var adminUsers = await Users.findAll({
        where: {
            userType: 1
        }
    });

    for (var i = 0; i < adminUsers.length; i++)
        sendEmail(users[i].user.email, "Trip Request Raised!: " + users[i].user.email, html);

}

//tripApproval: Get group who approved the trip.
//nextApprover: get group who has been sent the trip.
//userId: User whose trip is approved and sent.
const approveTripEmailer = async (tripApproval, nextApprover, userId) => {

    try {
        // const client = new SNSClient({ region: "us-east-1" });
        var params = {
            Message: 'MESSAGE_TEXT', /* required */
            TopicArn: 'arn:aws:sns:us-east-1:759222578990:Demo1'
        };

        var publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();

        // Handle promise's fulfilled/rejected states
        publishTextPromise.then(
            function (data) {
                console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
                console.log("MessageID is " + data.MessageId);
            }).catch(
                function (err) {
                    console.error(err, err.stack);
                });

    } catch (e) {
        var data = "";
    }


    var trip = await Trip.findOne({
        where: {
            tripId: tripApproval.trip_id
        }
    });

    var tripUser = await Users.findOne({
        where: {
            userId: userId
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
            userId: userId
        }
    });

    var approvedFromGroup = await Group.findOne({
        where: {
            grp_id: tripApproval.grp_approver.to_grp_id
        }
    });

    var sentToGroup = await Group.findOne({
        where: {
            grp_id: nextApprover.to_grp_id
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

module.exports = {
    sendForApprovalEmailer,
    approveTripEmailer
};