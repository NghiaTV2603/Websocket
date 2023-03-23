const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv')

const app = express();
const userRouter = require('./src/routes/user.router');
const bodyParser = require('body-parser');
const db = require('./src/confix/db');

//connect db
db.connect();
dotenv.config()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use('/api/v1/', userRouter);

const PORT = process.env.PORT || 3000
console.log(PORT)
app.listen(PORT, () => {
   console.log(`Example app listening on port ${PORT}`);
});
// ip : 127.0.0.1 - localhost
