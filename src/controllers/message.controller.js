const Message = require("../models/message.model")

const messageController = {
    dataMessage : async (req,res,next) => {
        try{
            const chatId = req.params.chatId ;
            const data = await Message.find({

            })
        }catch (e) {

        }
    }
}