//var app = angular.module('starter.models', []);
//app.value('start', 'models');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mobile-app');
//app.factory('starter.userFactory', function($scope) {  
	var users = mongoose.Schema({
		name: String,
		lastname: String,
		email: String,
		phoneNumber: Number,
		password: String
	});
//});
module.exports = mongoose.model('users', users);
