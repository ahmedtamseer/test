
const COMMON_SERVICE = require("../services/commonService");
const DB_CONN = require("../db/dbCon");
const { resolve } = require("path");

module.exports = {
    SignUp
}

function SignUp(req, res, next) {
    try {
        if (!req.body || !Array.isArray(req.body.users)) {
            return res.status(400).json({ message: 'Please provide valid user info' })
        }

        const data = req.body.users;

        let userPromises = [];
        data.forEach(user => {
            userPromises.push(_CreateUser(user));
        })

        Promise.all(userPromises)
            .then(user => {
                return res.status(201).json({ message: 'User created' })
            })
            .catch(err => {
                return req.status(500).json({ message: err.message })
            })

    } catch (error) {
        return req.status(500).json({ message: "Something went wrong!" })
    }
}


function _CreateUser(userData) {
    return new Promise((resolve, reject) => {
        try {

            if (!COMMON_SERVICE.CheckValidEmail(userData.email))
                return reject({ message: 'Please provide valid email' })

            _AnotherFunction(userData)
                .then(resolve)
                .catch(reject);

        } catch (error) {
            return reject(error)
        }
    })
}

function _AnotherFunction(userData) {
    return new Promise((resolve, reject) => {
        try {

            DB_CONN.getConnection((err, connection) => {

                if (err) return reject(err);

                connection.beginTransaction((err) => {

                    if (err) {
                        connection.release();
                        return reject(err);
                    }

                    _AddToDb(connection, userData, (err, created) => {

                        if (err) {
                            connection.release();
                            return reject(err);
                        }

                        connection.commit(err => {

                            connection.release();

                            if (err) {
                                return reject(err);
                            }

                            return resolve(userData);

                        })
                    })

                })

            })

        } catch (error) {
            return reject(error)
        }
    })
}


function _AddToDb(connection, userData, callback) {
    try {

        const _QUERY = "INSERt", // sql uery
            _VAL = [userData.email, userData.name]; // sql uery

        _ExecuteQuery(connection, _QUERY, _VAL)
            .then(userCreated => {

                const _QUERY2 = "INSERt", // sql uery
                    _VAL2 = [userData.email, userData.name]; // sql uery

                _ExecuteQuery(connection, _QUERY2, _VAL2)
                    .then(final => callback(null, final))
                    .catch(callback)
            }).catch(callback)


    } catch (error) {
        return callback(error)
    }
}

function _ExecuteQuery(connection, query, val) {
    return new Promise((resolve, reject) => {
        connection.query(_QUERY, _VAL, (err, created) => {
            if (err) return reject(err);
            return resolve(created);
        })

    })
}