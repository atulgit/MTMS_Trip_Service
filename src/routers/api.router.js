const express = require('express');

const apiController = require('../controllers/api.controller');

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

router.get('/tripsbystatus', apiController.getTripsByStatus);

// Endpoints for updating/deleting a record
router.route('/:id').put(apiController.updateUser).delete(apiController.deleteUser);

module.exports = router;
