const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
// const bcrypt = require('bcrypt');
const saltRounds = 10; // số lần mã hóa
console.log(JWT_SECRET);
const AuthController = {
    login: async (req, res, next) => {
        try {
            const { username, password } = req.body;
            const data = await User.findOne({
                username,
            });
            console.log(data);
            if (data) {
                // const isMatch = await bcrypt.compare(password, data.password);
                const isMatch = true;
                if (!isMatch) {
                    return res.status(400).json('Invalid username or password');
                }
                const token = jwt.sign({ id: data._id }, 'JWT_SECRET');
                res.json({
                    data,
                    token,
                });
            } else {
                res.status(400).json('Invalid username or password');
            }
        } catch (e) {
            console.log('[error login : ]' + e);
            res.status(400).json('Error login');
        }
    },
    register: async (req, res, next) => {
        try {
            const { username, password } = req.body;
            console.log(req.body);
            // const hashedPassword = await bcrypt.hash(password, saltRounds);
            const hashedPassword = 'nghia';
            if (!username || !password) {
                return res
                    .status(400)
                    .json('Please enter all the fields');
            }
            const user = await User.findOne({ username });
            if (user) {
                return res.status(400).json('User already exists');
            }
            const newUser = await User.create({
                username,
                password: hashedPassword,
            });
            const token = jwt.sign({ id: newUser._id }, 'JWT_SECRET');
            res.status(201).json({data: newUser , token});
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    },
    checkToken: async (req, res, next) => {
        try {
            const tokenRequest = req.headers.authorization;
            const token = tokenRequest.split(' ')[1];
            const id = await jwt.verify(token, 'JWT_SECRET');
            req.id = id.id;
            next();
        } catch (e) {
            console.log(['checkToken log error : '] + e);
            res.status(401).json('error token');
        }
    },
};

module.exports = AuthController;
