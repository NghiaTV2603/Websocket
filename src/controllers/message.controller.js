const Message = require("../models/message.model")
const User = require("../models/user.model")
const Chat = require("../models/chat.model")

const messageController = {
    dataMessage : async (req,res,next) => {
        try{
            const chatId = req.params.chatId ;
            const data = await Message.find({
                chat : chatId
            }).populate("sender","-password").populate("chat").sort({ createdAt: -1 });
            res.json(data);
        }catch (e) {
            res.status(500);
            throw new Error(e.message);
        }
    },
    sendMessage : async (req,res,next) => {
       const {chatId , content} = req.body
        if (!content || !chatId) {
            console.log("Invalid data passed into request");
            return res.sendStatus(400);
        }
        var newMessage = {
            sender: req.id,
            content: content,
            chat: chatId,
        };
        try{
            var message = await Message.create(newMessage)
            message = await message.populate("sender", "username avatar");
            message = await message.populate("chat");
            message = await User.populate(message, {
                path: "chat.users",
                select: "name pic email",
            });
            await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
            res.json(message);
        }catch (e) {
            res.status(400);
            res.send(e.message);
        }
    }
}

module.exports = messageController