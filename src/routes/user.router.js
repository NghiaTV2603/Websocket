const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const AuthController = require('../controllers/auth.controller');

router.get('/',AuthController.checkToken,UserController.listData);
router.get('/search',AuthController.checkToken,UserController.searchUser);
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

module.exports = router;
