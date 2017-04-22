var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var User = require('./users');

router.get('/signup', function(req, res)
{
	res.render('signup');
});

router.post('/signup', function(req, res)
{
	var name = req.body.name;
	var lastname = req.body.lastname;
	var email = req.body.email;
	var phoneNumber = req.body.phoneNumber;
	var password = req.body.password;

	var errors = req.validationErrors();

	if(errors){
		res.render('signup',{
			errors:errors
		});
	} 
	else {
		var newUser = new User({
			name: name,
			lastname: lastname,
			email:email,
			phoneNumber: phoneNumber,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) {
				alert(err);
			}
			
		});
		alert('You are registered and can now login');
		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/app/login');
	}
});
/*exports.index = function(req, res){
	res.render('index', { title: 'ejs' });
};*/

module.exports = router;
