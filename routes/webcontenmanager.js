//web conten manager
var express = require('express');
var crypto = require('crypto');
var Admin= require('../database/webmanager.js');
var pemberikerja= require('../database/userkerja');
var Auth= require('../Auth/auth');
//var Auth_mdw = require('../middlewares/auth');
var router = express.Router();
//var rahasia='terserah';
var secret = 'sukasuka';
var session_store;
//Pemberi Kerja
var Input= require('../database/addlowker');
var UserPemberiKerja = require('../database/userkerja')
var addlowker = require ("../controller/addlowker.js");

//
router.get('/',Auth.is_admin ,function (req,res,next){
  Input.find().sort([['createdAt',-1]]).exec(function (err,addlowkers){
    if (err){
      console.log("Error:", err);
    }
    else {
      res.render("../views/webcontenmanager/datalowker.ejs",{addlowkers:addlowkers});
    }
  });
});





router.get('/login',function(req, res, next) {
  res.render('webcontenmanager/login.ejs');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  session_store = req.session;
  var password = crypto.createHmac('sha256', secret)
                   .update(req.param('password'))
                   .digest('hex');

  if (req.param('NamaPengguna') == ""  || req.param('password') == "")
  {
      req.flash('info', 'Punten, tidak boleh ada field yang kosong!');
      res.redirect('/login');
  }
  else
  {
      Admin.find({ NamaPengguna: req.param('NamaPengguna'), password:password }, function(err, user) {
      if (err) throw err;

      if (user.length > 0)
      {
          session_store.NamaPengguna = user[0].NamaPengguna;
          session_store.admin = user[0].admin;

          res.redirect('/webcontenmanager/datalowker');
      }
      else
      {
          req.flash('info', 'Sepertinya akun Anda salah!');
          res.redirect('/webcontenmanager/login');
      }

    });
  }
});

router.get('/logout', function(req, res){
    req.session.destroy(function(err){
    if(err){
      console.log(err);
    }
    else
    {
      res.redirect('/webcontenmanager/login');
    }
  });
});
//Pemberi Kerja



// Get all addlowker
router.get('/datalowker',Auth.is_admin ,function (req,res,next){
  Input.find().sort([['createdAt',-1]]).exec(function (err,addlowkers){
    if (err){
      console.log("Error:", err);
    }
    else {
      res.render("../views/webcontenmanager/datalowker.ejs",{addlowkers:addlowkers});
    }
  });
});

// Get single addlowker by id
router.get('/showdatalowker/:id',Auth.is_admin, function (req,res) {
  //addlowker.show(req,res);
  Input.findOne({_id: req.params.id}).exec(function (err , addlowker){
    if (err){
      console.log("Error:", err);
    }
    else {
      res.render("../views/webcontenmanager/showdatalowker.ejs",{addlowker:addlowker})
    }
  });
});

// Get all User Pemberi Kerja
router.get('/listpemberikerja',Auth.is_admin,function (req,res,next){
  session_store= req.session_store;
  UserPemberiKerja.find({userpemberikerja:"true"}).sort([['_id',-1]]).exec(function (err,pemberikerjas){
    if (err){
      console.log("Error:", err);
    }
    else {
      res.render("../views/webcontenmanager/datapemberikerja.ejs",{pemberikerjas:pemberikerjas});
    }
  });
});
router.get('/showpemberikerja/:id',Auth.is_admin, function (req,res) {
  //addlowker.show(req,res);
  UserPemberiKerja.findOne({_id: req.params.id}).exec(function (err , pemberikerja){
    if (err){
      console.log("Error:", err);
    }
    else {
      res.render("../views/webcontenmanager/showpemberikerja.ejs",{pemberikerja:pemberikerja})
    }
  });
});

// Get UserPencariKerja
router.get('/listpencarikerja',Auth.is_admin,function (req,res,next){
  session_store= req.session_store;
  UserPemberiKerja.find({userpencarikerja:"true"}).sort([['_id',-1]]).exec(function (err,pencarikerja){
    if (err){
      console.log("Error:", err);
    }
    else {
      res.render("../views/webcontenmanager/listpencarikerja.ejs",{pencarikerja:pencarikerja});
    }
  });
});
// Get Detail UserPencariKerja
router.get('/listpencarikerja/:id',Auth.is_admin, function (req,res) {
  //addlowker.show(req,res);
  UserPemberiKerja.findOne({_id: req.params.id}).exec(function (err , pencarikerja){
    if (err){
      console.log("Error:", err);
    }
    else {
      res.render("../views/webcontenmanager/listpencarikerja_detail.ejs",{pencarikerja:pencarikerja})
    }
  });
});

//delete lowker by id
router.post('/delete/:id', Auth.is_admin,function (req,res){
  addlowker.hapus (req,res);
});
//Hapus USer pemberikerja
router.post('/hapuspemberikerja/:id',Auth.is_admin, function (req,res){
  addlowker.hapuspemberikerja (req,res);
});
//Hapus USer pemberikerja
router.post('/hapuspencarikerja/:id',Auth.is_admin, function (req,res){
  addlowker.hapuspencarikerja (req,res);
});

module.exports = router;
