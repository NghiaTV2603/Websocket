const express = require('express');
const router = express.Router();
const authenController = require('../controllers/auth.controller');
const messageController = require("../controllers/message.controller")

router.get('/:chatId', authenController.checkToken, messageController.dataMessage);
router.post('/sendMessage', authenController.checkToken, messageController.sendMessage);


module.exports = router;