const pool = require('../databases/mysql.db');

class User {
    constructor(name, email, employeeCode, userType) {
        this._name = name;
        this._email = email;
        this._employeeCode = employeeCode;
        this._userType = userType;
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
        const sql = `INSERT INTO users (name, email, employeeCode, userType) VALUES ("${this._name}", "${this._email}", "${this._employeeCode}", ${this._userType})`;
        return await pool.execute(sql);
    }

    async saveAproover(fromUserId, toUserId, isLastAproover) {
        const sql = `INSERT INTO aproovers (fromUserId, toUserId, isLastAproover) VALUES (${fromUserId}, ${toUserId}, ${isLastAproover})`;
        await pool.execute(sql);
    }

    static async getTripDetail(tripId) {
        const sql = `CALL Get_Trip_Detail(${tripId})`;
        const [rows, fields] = await pool.execute(sql);
        return rows[0];
    }

    static async createTrip(userId, name, reason, startDate,
        endDate, projectId, travelMode,
        hotelFromDate, hotelToDate, fromCountry,
        toCountry, fromCity, toCity) {

        const sqlTrip = `CALL Create_Trip(${userId}, ${projectId}, "${name}", "${fromCountry}", "${toCountry}", "${fromCity}", "${toCity}", '${startDate}', '${endDate}', '${hotelFromDate}', '${hotelToDate}', "${reason}", ${travelMode})`;

        var lastRow = (await pool.execute(sqlTrip));
        var insertId = lastRow[0][0][0].insertId;

        //Find approver Id for user who creates trip.
        const sqlApprover = `Select approverId, fromUserId, toUserId from aproovers where fromUserId=${userId}`;
        const [rows, fields] = (await pool.execute(sqlApprover));
        var approverId = rows[0].approverId;

        var isApproved;
        if (rows[0].toUserId == -1) //If Last approver, approve the trip.
            isApproved = 2;
        else //if not last approver
            isApproved = 0; //start with Pending status

        //Create approval for trip without sending for approval.
        const sqlApproval = `Insert into aproovals (tripId, aprooverId, isAprooved) values (${insertId}, ${approverId}, ${isApproved})`;
        var approvalId = (await pool.execute(sqlApproval))[0].insertId;

        // var d = "";

        return insertId;
    }

    static async getProjects() {
        const sqlProjects = `Select * from projects`;
        const [rows, fields] = (await pool.execute(sqlProjects));
        return rows;
    }

    static async updateTrip(tripId, name, fromLocation, toLocation) {
        const sqlApprove = `CALL Update_Trip(${tripId}, "${name}", "${fromLocation}", "${toLocation}")`;
        await pool.execute(sqlApprove);
    }

    static async approveTrip(tripId, approverId, userId) {
        //Approve existing approval
        const sqlApprove = `CALL Approve_Trip("${tripId}", "${approverId}")`;
        await pool.execute(sqlApprove);

        //Create new and update existing approval to send
        const sqlSendForApproval = `CALL Send_Trip_For_Approval("${tripId}", "${userId}")`;
        await pool.execute(sqlSendForApproval);
    }

    static async rejectTrip(tripId, approverId, userId) {
        //Reject existing approval
        const sqlApprove = `CALL Reject_Trip(${tripId}, ${approverId})`;
        await pool.execute(sqlApprove);
    }

    static async find() {
        const sql = 'Call Get_Users()';
        const [rows, fields] = await pool.execute(sql);

        return rows[0];
    }

    static async sendForApproval(tripId, userId) {
        const sqlResetTripApprovals = `Call Reset_Trip_Approvals(${tripId})`;
        const [rows_apr, fields_apr] = await pool.execute(sqlResetTripApprovals);

        const sql = `Call Send_Trip_For_Approval(${tripId}, ${userId})`;
        const [rows, fields] = await pool.execute(sql);

        return rows[0];
    }

    static async getMyTrips(userId) {
        const sql = `CALL Get_Trips("${userId}")`;
        const [rows, fields] = await pool.execute(sql);
        return rows[0];
    }

    static async getApprovedTrips() {
        const sql = `CALL Get_Approved_Trips()`;
        const [rows, fields] = await pool.execute(sql);
        return rows[0];
    }


    static async getOthersTrips(userId) {
        const sql = `CALL Get_Others_Trips("${userId}")`;
        const [rows, fields] = await pool.execute(sql);
        return rows[0];
    }

    static async login(email, password) {
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
