const pool = require('../databases/mysql.db');

class User {
    constructor(name, email, employeeCode) {
        this._name = name;
        this._email = email;
        this._employeeCode = employeeCode;
    }

    // get firstName() {
    //     return this._firstName;
    // }

    // set firstName(firstName) {
    //     if (!firstName) throw new Error('Invalid first name value.');

    //     firstName = firstName.trim();
    //     if (firstName === '') throw new Error('Invalid first name value.');

    //     this._firstName = firstName;
    // }

    // get lastName() {
    //     return this._lastName;
    // }

    // set lastName(lastName) {
    //     if (!lastName) throw new Error('Invalid last name value.');

    //     lastName = lastName.trim();
    //     if (lastName === '') throw new Error('Invalid last name value.');

    //     this._lastName = lastName;
    // }

    // get age() {
    //     return this._age;
    // }

    // set age(age) {
    //     if (age < 0) throw new Error('Invalid age value.');

    //     this._age = age;
    // }

    async save() {
        const sql = `INSERT INTO users (name, email, employeeCode) VALUES ("${this._name}", "${this._email}", "${this._employeeCode}")`;
        return await pool.execute(sql);
    }

    async saveAproover(fromUserId, toUserId, isLastAproover){
        const sql = `INSERT INTO aproovers (fromUserId, toUserId, isLastAproover) VALUES (${fromUserId}, ${toUserId}, ${isLastAproover})`;
        await pool.execute(sql);
    }

    static async createTrip(userId, name, fromLocation, toLocation) {
        const sqlTrip = `INSERT INTO trips (name, fromLocation, toLocation) VALUES ("${name}", "${fromLocation}", "${toLocation}")`;
        var insertId = (await pool.execute(sqlTrip))[0].insertId;

        const sqlApprover = `Select approverId from aproovers where fromUserId=${userId}`;
        const [rows, fields] = (await pool.execute(sqlApprover));
        var approverId = rows[0].approverId;

        const sqlApproval = `Insert into aproovals (tripId, aprooverId) values (${insertId}, ${approverId})`;
        var approvalId = (await pool.execute(sqlApproval))[0].insertId;

        var d = "";

    }

    static async find() {
        const sql = 'SELECT * FROM users';
        const [rows, fields] = await pool.execute(sql);

        return rows;

    }

    static async getMyTrips(userId){
        const sql = `CALL Metyis_Trip.Get_Trips("${userId}")`;
        const [rows, fields] = await pool.execute(sql);
        return rows[0];
    }

    static async getOthersTrips(userId) {
        const sql = `CALL Metyis_Trip.Get_Others_Trips("${userId}")`;
        const [rows, fields] = await pool.execute(sql);
        return rows[0];
    }

    static async login(email, password){
        const sql = `Select * from users WHERE email = "${email}"`;
        const [rows, fields] = await pool.execute(sql);
        return rows;
    }

    static async findByIdAndUpdate(id, options) {
        const sql = `UPDATE users SET first_name = "${options.firstName}", last_name = "${options.lastName}", age = ${options.age} WHERE id = "${id}"`;
        await pool.execute(sql);
    }

    static async findByIdAndDelete(id) {
        const sql = `DELETE FROM users WHERE id = "${id}"`;
        await pool.execute(sql);
    }
}

module.exports = User;
