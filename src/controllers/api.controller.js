const User = require('../models/user.model');

const createTrip = async(req, res) => {
    var body = req.body;
    var json = JSON.parse(JSON.stringify(body));


    try {
        const users = await User.createTrip(json["userId"], json["name"], json["fromLocation"], json["toLocation"]);

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

const loginUser = async (req, res) => {
    try {
        var body = req.body;
        var json = JSON.parse(JSON.stringify(body));
        
        const email = req.params.email;
        const users = await User.login(json["email"], json["password"]);

        if(users.length == 1)
        {
            res.send({
                statusCode: 200,
                statusMessage: 'Ok',
                message: 'Successfully retrieved all the users.',
                data: users[0],
            });
        }
        else
        {
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
        const user = new User(json["name"], json["email"], json["employeeCode"]);
        var result = await user.save();
    
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

        res.status(200).send({
            statusCode: 201,
            statusMessage: 'Created',
            message: 'Successfully created a user.',
            data: JSON.stringify(result),
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

const getMyTrips = async (req, res) => {
    var userId = req.query.userId;

    try {
        var result = await User.getMyTrips(userId);

        res.status(200).send({
            statusCode: 201,
            statusMessage: 'Created',
            message: 'Successfully created a user.',
            data: JSON.stringify(result),
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
    getOthersTrips,
    getMyTrips,
    createTrip,
    loginUser,
    getUsers,
    addUser,
    updateUser,
    deleteUser,
};
