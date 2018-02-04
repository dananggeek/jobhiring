var LocalStrategy = require('passport-local').Strategy;
var User = require('../database/userkerja');

var config = require('../config/database');
var bcrypt = require('bcryptjs');

module.exports = function(passport){
  passport.use(new LocalStrategy(
    function(username, password, done) {
     User.findOne({ 'login.username':  username }, function(err, user) {
     	if(err) throw err;
     	if(!user){
     		return done(null, false, {msg: 'Unknown User'});
     	}


     	User.comparePassword(password, user.login.password, function(err, isMatch){
     		if(err) throw err;
     		if(isMatch){
     			return done(null, user);
     		} else {
     			return done(null, false, {msg: 'Invalid password'});
     		}
     	}) //ahir daftar comparePassword
    })//ahor daftar


    //


    }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      done(err, user);
    });
  });

}
