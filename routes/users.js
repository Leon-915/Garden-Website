var express = require('express');

var util = require("util");

var router = express.Router();

var Users = require('../models/users.js');



router.get('/', function(req, res, next) {
  Users.find(function (err, users) {
    if (err) return next(err);
    res.json(users);
  });
});

/* POST /category */
router.post('/', function(req, res, next) {
  Users.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /category/id */
router.get('/:id', function(req, res, next) {
  Users.findById(req.params.id, function (err, post) {
    if (err) 
      {return next(err);

      }
    res.json(post);
  });
});

router.get('/byfb/:id', function(req, res, next) {

  Users.find({ fbid: req.params.id }, function(err, post) {
     if (err) 
     {

         res.writeHead(204, {"Content-Type": "application/json"});
  
          var json = JSON.stringify({ 
            message: 'There was an error'
          });
          res.end(json);
     }else
     {
          res.writeHead(200, {"Content-Type": "application/json"});
  
          var json = JSON.stringify({ 
            data: post
          });
          res.end(json);

     }

     
  });

 
});






/* PUT /category/:id */
router.put('/:id', function(req, res, next) {
  Users.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});



/* DELETE /category/:id */
router.delete('/:id', function(req, res, next) {
  Users.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    Users.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
  });
});







 

module.exports = router;