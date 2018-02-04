var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
	login: {
		username: String,
		password:String,
	},

		nama:String,
		alamat:String,
    tanggal_lahir:String,
		email:String,
		kelamin:String,




});

var userpencarikerja = module.exports = mongoose.model('userpencarikerja', UserSchema);

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
	userpencarikerja.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	userpencarikerja.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
