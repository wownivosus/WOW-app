var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/ionicapp');

var data = mongoose.model('Todos', {
  name: String,
  description: String
});

var app = express();

//get all the todos from the database
app.get('/api/todos', function(req, res){
  data.find(function(err, todos){
    if(err)
      res.send(err)
    res.json(todos);
  });
});

//create a todo
app.post('/api/todos', function(req,res){
  data.create({
    name: req.body.task.title
  }, function(err, todo){
      if(err)
        res.send(err);
      data.find(function(err, todos){
        if(err)
          res.send(err)
        res.json(todos);
      });
  });
});

app.delete('/api/todos/:todo_id', function(req, res){
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
app.listen(9000);
console.log('App is listening on port 9000')