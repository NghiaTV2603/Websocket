const Chat = require('../models/chat.model');
const User = require('../models/user.model');
const chatController = {
    accessChat: async (req, res, next) => {
        const { userId } = req.body;
        if (!userId) {
            console.log('UserId param not sent with request');
            return res.status(400).json('UserId param not sent with request');
        }
        var isChat = Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ],
        })
            .populate('users', '-password')
            .populate('latestMessage');

        isChat = await User.populate(isChat, {
            path: 'latestMessage.sender',
            select: 'username avatar',
        });
        if (isChat.length > 0) {
            res.send(isChat[0]);
        } else {
            var chatData = {
                chatName: 'sender',
                isGroupChat: false,
                users: [req.id, userId],
            };
        }
        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({
                _id: createdChat._id,
            }).populate('users', '-password');
            res.status(200).json(FullChat);
        } catch (e) {
            console.log(e);
        }
    },
    listChat: async (req, res, next) => {
        try {
            var listChat = Chat.find({
                users: { $elemMatch: { $eq: req.id } },
            })
                .populate('users', '-password')
                .populate('latestMessage')
                .sort({ updatedAt: -1 });
            listChat = await User.populate(listChat, {
                path: 'latestMessage.sender',
                select: 'name pic email',
            });
            res.status(200).send(listChat);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Server error' });
        }
    },
    accessGroupChat: async (req, res, next) => {
        const { users, chatName } = req.body;
        console.log(req.body);
        if (!users || !chatName) {
            console.log('users and name param not sent with request');
            return res.status(400).json('UserId param not sent with request');
        }
        const usersID = JSON.parse(users);
        if (usersID.length < 2) {
            console.log('More than 2 users are required to form a group chat');
            return res
                .status(400)
                .json('More than 2 users are required to form a group chat');
        }
        usersID.push(req.id);
        try {
            const newChat = await Chat.create({
                chatName: chatName,
                isGroupChat: true,
                users: usersID,
                groupAdmin: req.id,
            });
            var fetchChat = await Chat.find({
                _id: newChat._id,
            })
                .populate('users', '-password')
                .populate('groupAdmin', '-password');
            res.status(200).json(fetchChat);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Server error' });
        }
    },
    seenMessage : async (chatId) => {
        try{
            var chat = await Chat.findByIdAndUpdate({_id : chatId },{seen : true })
        }catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Server error' });
        }
    }
};

module.exports = chatController;
