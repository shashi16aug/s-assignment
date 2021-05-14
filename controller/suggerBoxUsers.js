const bcrypt = require("bcrypt");
const config = require("../config/config.json")
const userHealper = require('../utils/userHealpers');
const Users = require('../models/suggerboxUsers');


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * userCreate method will use to create new user this wil take  user email and password as request 

 */
exports.userCreate = async(req, res) => {
    try {
        // /** checkEmailExists :: use email already exiest or not , i'm already validating email from model */
        let userExist = await userHealper.getUserIfEmailExists(req.body.email);
        // console.log(userExist)
        if (!userExist) {
            let hashPassword = await userHealper.createUserPassword(req.body.password)
            let createNewUser = new Users({
                name: req.body.name,
                email: req.body.email,
                last_name: req.body.last_name,
                contact: req.body.contact,
                password: hashPassword
            })
            await createNewUser.save()
            return res.status(201).json({
                "status_code": 201,
                "success": true,
                'message': "user successfully registered",
                'data': {}

            });
        } else {
            return res.status(406).json({
                "status_code": 406,
                "success": false,
                'message': "email alredy exists!",
                'data': {}

            });
        }
    } catch (err) {
        return res.status(500).json({
            "status_code": 500,
            "success": false,
            'message': err.message,
            'data': {}

        });
    }
}


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * this method is used for user login
 */

exports.userLogIn = async(req, res) => {
    try {
        // /** checkEmailExists :: use email already exiest or not , i'm already validating email from model */
        let userExist = await userHealper.getUserIfEmailExists(req.body.email);
        if (!userExist) {
            return res.status(401).json({
                "status_code": 401,
                "success": false,
                'message': "Login failed",
                'data': {}

            });
        } else {
            const validPwd = await bcrypt.compare(req.body.password, userExist.password);
            if (validPwd && userExist.is_user_active) {
                let payLoad = {
                    'name': userExist.name,
                    'email': userExist.email
                }
                let jwtToken = await userHealper.generateJwtToken(payLoad);
                return res.status(200).json({
                    "status_code": 200,
                    "success": true,
                    'message': "login successfully",
                    'data': { jwtToken }
                });
            } else {
                return res.status(401).json({
                    "status_code": 401,
                    "success": false,
                    'message': "Login failed",
                    'data': {}

                });
            }

        }
    } catch (err) {
        return res.status(500).json({
            "status_code": 500,
            "success": false,
            'message': err.message,
            'data': {}

        });
    }
}


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * this method is used for listing of user with pagination
 */

exports.userList = async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const dbLimit = config.db_limit
        const numOfUsers = await Users.count({});
        const user = await Users.find({}, 'name email is_user_active')
            .skip((dbLimit * page) - dbLimit)
            .limit(dbLimit);
        return res.status(200).json({
            "status_code": 200,
            "success": true,
            'message': "data successfully fetched",
            'data': {
                "currentPage": page,
                "pages": Math.ceil(numOfUsers / dbLimit),
                "numOfResults": numOfUsers,
                "users": user
            }
        });
    } catch (err) {
        return res.status(500).json({
            "status_code": 500,
            "success": false,
            'message': err.message,
            'data': {}

        });
    }
}