const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const AuthController = {
    login: async (req, res, next) => {
        try {
            const { username, password } = req.body;
            const data = await User.findOne({
                username,
                password,
            });

            if (data) {
                const token = jwt.sign({ id: data._id }, 'privateKey');
                res.json({
                    data,
                    token,
                });
            } else {
                res.status(400).json('error login null');
            }
        } catch (e) {
            console.log('[error login : ]' + e);
            res.status(400).json('Error login');
        }
    },
    register: async (req, res, next) => {
        try {
            const { username, password, fullName } = req.body;
            const data = await User.create({
                username,
                password,
                fullName,
            });

            res.json(data);
        } catch (e) {
            console.log(['register log error : '] + e);
            res.status(500).json('error');
        }
    },
    checkToken: async (req, res, next) => {
        try {
            const tokenRequest = req.headers.authorization;
            const token = tokenRequest.split(' ')[1];
            const tokenVerify = await jwt.verify(token, 'privateKey');
            next();
        } catch (e) {
            console.log(['checkToken log error : '] + e);
            res.status(500).json('error token');
        }
    },
};

module.exports = AuthController;
