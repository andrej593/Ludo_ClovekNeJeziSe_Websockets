var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var UserSchema = new Schema({
	'username' : String,
	'password' : String,
	'email' : String,
	'nickname' : String,
	'gamesPlayed' : Number,
	'firstP' : Number,
	'secondP' : Number,
	'thirdP' : Number,
	'fourthP' : Number
});

module.exports = mongoose.model('User', UserSchema);
