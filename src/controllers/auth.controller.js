const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET
console.log(JWT_SECRET);
const AuthController = {
    login: async (req, res, next) => {
        try {
            const { username, password } = req.body;
            const data = await User.findOne({
                username,
                password,
            });
            if (data) {
                const token = jwt.sign({ id: data._id },"JWT_SECRET");
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
            const { username, password } = req.body;
            if (!username || !password) {
                return res
                    .status(400)
                    .json({ message: 'Please enter all the fields' });
            }
            const user = await User.findOne({ username });
            if (user) {
                return res.status(400).json({ message: 'User already exists' });
            }
            const newUser = await User.create({ username, password });
            res.status(201).json(newUser);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    },
    checkToken: async (req, res, next) => {
        try {
            const tokenRequest = req.headers.authorization;
            const token = tokenRequest.split(' ')[1];
            const tokenVerify = await jwt.verify(token, "JWT_SECRET");
            next();
        } catch (e) {
            console.log(['checkToken log error : '] + e);
            res.status(401).json('error token');
        }
    },
};

module.exports = AuthController;
