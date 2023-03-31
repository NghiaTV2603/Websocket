const User = require('../models/user.model');

const UserController = {
    listData: async (req, res, next) => {
        try {
            const data = await User.find();
            if (data) {
                res.json(data);
            } else {
                res.status(500).message('error');
            }
        } catch (e) {
            console.log(['listData log error : '] + e);
        }
    },
    searchUser : async (req,res,next) => {
        try{
            const users = await User.find( { username: { $regex: req.query.username, $options: 'i' }} )
            res.json({data : users})
        }catch (e) {
            console.log(['updateUser log error : '] + e);
            res.status(500).json('error');
        }
    },
    updateUser: async (req, res, next) => {
        try {
            const data = await User.findByIdAndUpdate(
                req.params.id,
                {
                    password: req.body.password,
                },
                { new: true }
            );
            res.json(data);
        } catch (e) {
            console.log(['updateUser log error : '] + e);
            res.status(400).json('error');
        }
    },
    deleteUser: async (req, res, nest) => {
        try {
            const data = await User.findByIdAndRemove(req.params.id);
            res.json(data);
        } catch (e) {
            console.log(['deleteUser log error : '] + e);
            res.status(400).json('error update by id');
        }
    },
    getUser : async (req,res,next) => {
        try{
            const {id} = req.params ;

        }catch (e) {
            
        }
    }
};

module.exports = UserController;
