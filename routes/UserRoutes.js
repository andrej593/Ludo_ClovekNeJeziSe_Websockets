var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController.js');

router.get('/login', UserController.showLogin);
router.get('/register', UserController.showRegister);
router.get('/homePage', UserController.checkJWT ,UserController.showHomePage);
router.get('/profile', UserController.checkJWT ,UserController.showProfile);

router.post('/login', UserController.checkPass ,UserController.login, UserController.checkJWT, UserController.showHomePage);
router.get('/logout', UserController.checkJWT, UserController.logout);

router.get('/', UserController.list);
router.get('/:id', UserController.show);

router.post('/', UserController.create);

module.exports = router;
