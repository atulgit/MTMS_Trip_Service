var bodyParser = require('body-parser');

const express = require('express');

const apiController = require('../controllers/api.controller');
const mtmsEmailer = require('../models/emailer.model');

const { route } = require('../app');

const router = express.Router();

// Endpoint for getting all the records
router.get('/users', apiController.getUsers);

router.post('/login', apiController.loginUser);

// Endpoint for creating a new record
router.post('/new', apiController.addUser);

router.post('/approvetrip', apiController.approveTrip);

router.post('/rejecttrip', apiController.rejectTrip);

router.get('/mytrips', apiController.getMyTripsGroup);

router.get('/projects', apiController.getProjects);

router.get('/otherstrips', apiController.getOthersTripsGroup);

router.post('/trip', apiController.createTrip);

router.post('/updatetrip', apiController.updateTrip);

router.post('/canceltrip', apiController.cancelTrip);

router.get('/approverusers', apiController.getApproverUsers);

router.get('/usergroups', apiController.getUserGroups);

router.get('/deleteuser/:userId', apiController.deleteUser);

router.post('/deletetrip', apiController.deleteTrip);

router.post('/sendtrip', apiController.sendForApproval);

router.get('/userdetail', apiController.getUserDetail);

router.get('/approvers', apiController.getApprovers);

router.get('/tripdetail', apiController.getTripDetail);

// router.post('/endpoint', apiController.subcriptionEndpoint);

router.get('/tripsbystatus', apiController.getTripsByStatus);

// Endpoints for updating/deleting a record
router.route('/:id').put(apiController.updateUser).delete(apiController.deleteUser);

router.post('/endpoint',bodyParser.text(), mtmsEmailer.handleSNSMessage);

// async function handleSNSMessage(req, resp, next) {

//     try {
//         let payloadStr = req.body;
//         payload = JSON.parse(JSON.stringify(payloadStr));
//         console.log(payload);

//         if (req.header('x-amz-sns-message-type') === 'SubscriptionConfirmation') {
//             const url = payload.SubscribeURL;
//             console.log("Subscription Url for Endpoint: " + url);
//         } else if (req.header('x-amz-sns-message-type') === 'Notification') {
//             var attrs = JSON.parse(JSON.parse(JSON.stringify(payload))).MessageAttributes;

//             console.log(attrs.email.Value);
//             console.log(attrs.name.Value);
//         } else {
//             throw new Error(`Invalid message type ${payload.Type}`);
//         }
//     } catch (err) {
//         console.error(err)
//         resp.status(500).send('Oops')
//     }
//     resp.send('Ok')
// }
//
module.exports = router;


