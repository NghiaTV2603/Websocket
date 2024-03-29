const mongoose = require('mongoose');

const Chat = new mongoose.Schema(
    {
        chatName: {
            type: String,
            trim: true,
        },
        isGroupChat: {
            type: Boolean,
            default: false,
        },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
        },
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        seen : {
            type : Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Chat', Chat);
