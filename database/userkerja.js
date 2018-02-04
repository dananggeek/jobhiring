var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
	userpencarikerja:{type:Boolean, default:false},
	userpemberikerja:{type:Boolean, default:false},


	login: {
		username: String,
		password:String,
		email:String,
	},
	pemberikerja: {
		perusahaan:String,
		alamat:String,
		notelepon:String,
		deskrepsi:String,
	},
	pencarikerja: {
		nama:String,
		alamat:String,
		kelamin:String,

	},




});

var User = module.exports = mongoose.model('user', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.login.password, salt, function(err, hash) {
	        newUser.login.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {'login.username': username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
