const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const authenController = require('../controllers/auth.controller');

router.post('/access', authenController.checkToken, chatController.accessChat);
router.post('/accessGroup', authenController.checkToken, chatController.accessGroupChat);
router.get('/listChat', authenController.checkToken, chatController.listChat);

module.exports = router;
