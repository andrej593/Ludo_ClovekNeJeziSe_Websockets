var UserModel = require('../models/UserModel.js');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

let users=[]


module.exports = {
    users,
    showLogin: function (req, res) {
        return res.render('login', {message:"", user:""});
    },
   
    showRegister: function (req, res) {
        return res.render('register', {message:"", user:""});
    },

    showHomePage: function (req, res) {
        let username = req.user.username;
        let user = users.find(function(el){return el.user.username == username});
        return res.render('userHome', user);
    },

    showProfile:function (req, res) {
        let username = req.user.username;
        let user = users.find(function(el){return el.user.username == username});
        return res.render('profile', user);
    },

    checkJWT: function(req, res, next){
        let token = req.header("Authorization");
        if(!token){
            console.log("No token");
            return res.render('index',{ user:"" , message:"No token"});
        }
        if(token.startsWith("Bearer ")){
            token = token.substr(7);
            if(!users.find(function(user){return user.accessToken==token;})){
                console.log("not found");
                return res.render('index',{ user:"" , message:"Token expired!"});
            }
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
                if(err){
                    res.render('index',{ user:"" , message:err});
                }else{
                    req.user = decoded;
                    next();
                }
            });
        }else{
            return res.render('index',{ user:"" , message:"Wrong auth method"});
        }
    },

    checkPass: function (req, res, next){
        var username= req.body.username;
        var password= req.body.password;
        UserModel.findOne({username: username}, function (err, User) {
            if (err) {
                res.render('index',{ user:"" , message:err});
            }
            if (!User) {
                res.render('index',{ user:"" , message:"No such user"});
            }
            bcrypt.compare(password, User.password, (error, isMatch) => {
                if (error) {
                    res.render('index',{ user:"" , message:"Wrong password"});
                }
                if (isMatch) {
                    req.user=User;
                    return next();
                } else {
                    res.render('index',{ user:"" , message:"Wrong password"});
                }
            });
        });
    },

    login:function(req, res, next){
        let accessKey = process.env.ACCESS_TOKEN_SECRET;
        let data = {
            username: req.user.username,
        }
        const accessToken = jwt.sign(data, accessKey);
        let fulluser = {"accessToken":accessToken,"user":req.user};
        users.push(fulluser);
        //console.log(users);
        let message="Bearer "+accessToken;
        req.headers.authorization = message;
        next();
    },

    logout:function(req, res){
        let username = req.user.username;
        let user = users.find(function(el){return el.user.username == username});
        const index = users.indexOf(user);
        if (index > -1) {
            users.splice(index, 1);
        }
        res.render('index',{ user:"" , message:"Logged out."});
    },

    list: function (req, res) {
        UserModel.find(function (err, Users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting User.',
                    error: err
                });
            }
            return res.json(Users);
        });
    },

    show: function (req, res) {
        var id = req.params.id;
        UserModel.findOne({_id: id}, function (err, User) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting User.',
                    error: err
                });
            }
            if (!User) {
                return res.status(404).json({
                    message: 'No such User'
                });
            }
            return res.json(User);
        });
    },

    create: function (req, res) {
        var user = new UserModel({
			username : req.body.username,
			password : req.body.password,
			email : req.body.email,
			nickname : req.body.nickname,
			gamesPlayed : 0,
			firstP : 0,
			secondP : 0,
			thirdP : 0,
			fourthP : 0
        });
        bcrypt.genSalt(10, (err, salt) =>{
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) throw err;
                user.password = hash;
                user.save(function (err, user) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when creating User',
                            error: err
                        });
                    }
                    var message={message:"", user:""};
                    return res.render('login', message);
                });
            })
        });
    },
};
