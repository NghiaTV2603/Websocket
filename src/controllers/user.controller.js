const User = require('../models/user.model');
const {redisClient} = require('../redis.loader');

const UserController = {
    listData: async (req, res) => {
        try {
            const data = await User.find();
            if(!data) return res.status(500).message('error');
            res.json(data);
        } catch (e) {
            return console.log(['listData log error : '] + e);
        }
    },
    searchUser : async (req,res,next) => {
        try{
            const userCache = JSON.parse((await redisClient.get(`username/${req.query.username}`)) || null)
            const dataRes = userCache || await User.find( { username: { $regex: req.query.username, $options: 'i' }} )
            if(!userCache){
                await redisClient.set(`username/${req.query.username}`,JSON.stringify(dataRes));
            }
            return res.json({data : dataRes})
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
