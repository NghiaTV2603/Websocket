const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors')

const app = express();
const userRouter = require('./src/routes/user.router');
const chatRouter = require('./src/routes/chat.router');
const messageRouter = require('./src/routes/message.router');
const postRouter = require("./src/routes/post.router")
const bodyParser = require('body-parser');
const db = require('./src/confix/db');

//connect db
db.connect();
dotenv.config();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use('/api/v1/', userRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/message', messageRouter);
app.use('/api/v1/post', postRouter);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
// ip : 127.0.0.1 - localhost

//connect socket.io
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        // origin: 'https://app-social.vercel.app',
        origin: "*",
    },
});

io.on('connection', (socket) => {
    console.log('connected socket.io');
    socket.on('setup', (dataUser) => {
        socket.join(dataUser);
        console.log( "setup" +dataUser);
        socket.emit('connected');
    });

    socket.on('joinChat', (chatId) => {
        const id = chatId;
        socket.join(id);
        console.log('connected rom chat : ' + id);
    });

    socket.on('typing' ,(room) => {
        socket.in(room).emit("typing");
    })
    socket.on('stopTyping' ,(room) => {
        socket.in(room).emit("stopTyping");
    })

    socket.on('newMessage', (newMessage) => {
        var chat = newMessage.chat;
        if (!chat.users) {
            return console.log('users not defined');
        }
        chat.users.forEach((user) => {
            if (user._id == newMessage.sender._id) return;
            socket.in(user._id).emit('message received',newMessage);
        });
    });
});
