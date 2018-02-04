var express = require('express');
var router = express.Router();
//pasport
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//database addlowker
var addlowker = require ("../controller/addlowker.js");
var Input= require('../database/addlowker');
//databe user

var Daftar = require('../database/userkerja')
//
var flash =require('express-flash');

var Auth= require('../Auth/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.ejs', { title: 'Express' });
});
router.get('/nav', function(req, res, next) {
  res.render('nav.ejs', { title: 'Express' });
});

// Get all addlowker
router.get('/list',function (req,res,next){
  if(req.query.search){
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Input.find({Tag:regex}).sort([['createdAt',-1]]).exec(function (err,addlowkers){
      if (err){
        console.log("Error:", err);
      }
      else {
        res.render('list.ejs',{addlowkers:addlowkers});
      }
    });

  }else{

    Input.find().sort([['createdAt',-1]]).exec(function (err,addlowkers){
      if (err){
        console.log("Error:", err);
      }
      else {
        res.render('list.ejs',{addlowkers:addlowkers});
      }
    });
  } //ahir else
});
// Get single addlowker by id
router.get('/list/detail/:id', function (req,res) {
  //addlowker.show(req,res);
  Input.findOne({_id: req.params.id}).exec(function (err , addlowker){
    if (err){
      console.log("Error:", err);
    }
    else {
      res.render("../views/show.ejs",{addlowker:addlowker})
    }
  });
});
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
module.exports = router;
