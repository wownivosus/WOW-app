var mongoose = require('mongoose');
var brypt = require('bcrypt');

var userSchema = mongoose.Schema({ 
	name : String,
	lastname: String,
	email: String, 
	phoneNumber: Number,
	password: String
});
var User = module.exports = mongoose.model('users', userSchema); 

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

