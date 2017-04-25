var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');

mongoose.connect('mongodb://localhost/ionicapp');

var Schema = new mongoose.Schema({
  _id: String,
  name: String,
  number: Number
});
var data = mongoose.model('Todos', Schema);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/www');

app.use(bodyParser());
app.use(express.static(path.join(__dirname, 'public')));

//get all the todos from the database
app.get('/app/profiles', function(req, res){
  data.find(function(err, todos){
    if(err)
      res.send(err)
    res.json(todos);
  });
});

//create a todo

app.post('/app/profile/:todoId', function(req, res){
  console.log(req.body);
  // new data({
  //   _id    : req.body.task.email,
  //   name: req.body.task.name,
  //   number   : req.body.task.number        
  // }).save(function(err, doc){
  //   if(err) res.json(err);
  //   else    res.send('Successfully inserted!');
  // });
});


app.delete('/app/todo_id', function(req, res){
  data.remove({
    _id: req.params.todo_id
  }, function(err, todo){
       if(err)
        res.send(err);
      data.find(function(err, todos){
        if(err)
          res.send(err);
        res.json(todos);
      });
  });
});

module.exports = app;
app.listen(3000);
console.log('App is listening on port 3 000')