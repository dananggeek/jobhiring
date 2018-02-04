var express = require('express');
var router = express.Router();
//pasport
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//database addlowker
var addlowker = require ("../controller/addlowker.js");
var Input= require('../database/addlowker');
//databe user
var Ambilkerja = require('../database/ambilkerja');
var Daftar = require('../database/userkerja')
//
var flash =require('express-flash');

var Auth= require('../Auth/auth');

var session_store;
var formidable = require('formidable');
var fs = require('fs');
var pagination = require('pagination');
var faker = require('faker')

router.get('/' ,function (req,res,next){
  session_store= req.session_store;
  Daftar.find({'_id': req.param('id')});
  res.render('pemberikerja/index.ejs',{session_store:session_store });
});
// Get all addlowker by author

router.get('/listinputlowker',Auth.ensureAuthenticated,Auth.userpemberikerja,function (req,res,next){


  Daftar.findById(req.params.id, function(err, foundUser) {
    if(err) {
      req.flash("error", "Something went wrong.");
      res.redirect("/");
    }

    Input.find().sort([['createdAt',-1]]).where('author').equals(req.user._id).exec(function(err, addlowkers) {
      if(err) {
        req.flash("error", "Something went wrong.");
        res.redirect("/");
      }

      res.render("../views/pemberikerja/home.ejs",{user: foundUser, addlowkers: addlowkers});

    })
  })

});

// Get single addlowker by id
router.get('/show/:id',Auth.ensureAuthenticated,Auth.userpemberikerja, function (req,res) {
  //addlowker.show(req,res);
  Input.findOne({_id: req.params.id}).exec(function (err , addlowker){
    if (err){
      console.log("Error:", err);
    }
    else {
      res.render("../views/pemberikerja/show.ejs",{addlowker:addlowker})
    }
  });
});

// Create addlowker

router.get('/inputlowker', Auth.ensureAuthenticated,Auth.userpemberikerja, function (req,res){

  session_store = req.session;
  res.render("../views/pemberikerja/inputlowker.ejs");
});

// Save addlowker
router.post('/inputlowker', Auth.ensureAuthenticated,Auth.userpemberikerja,function (req, res,next){
  var NamaPekerjaan = req.body.NamaPekerjaan;
  var JenisPekerjaan = req.body.JenisPekerjaan;
  var Kemampuan = req.body.Kemampuan;
  var LokasiPekerjaan = req.body.LokasiPekerjaan;
  var Gaji = req.body.Gaji;
  var DeskrepsiPekerjaan = req.body.DeskrepsiPekerjaan;
  var Email = req.body.Email;
  var Tag = req.body.Tag;


    var tambahkerja = new Input({
          'NamaPekerjaan':NamaPekerjaan,
          'JenisPekerjaan':JenisPekerjaan,
          'Kemampuan': Kemampuan,
          'LokasiPekerjaan':LokasiPekerjaan ,
          'Gaji':Gaji ,
          'DeskrepsiPekerjaan': DeskrepsiPekerjaan,
          'Email':Email,
          'Tag':Tag,
          'author':req.user._id,
          //'author.id' : req.user._id,
    });
    tambahkerja.save(function (err){
      if (err) throw err;
      console.log(err);
    });
    res.redirect("/pemberikerja/listinputlowker");


});

// Edit addlowker
router.get('/editlowkers/:id',Auth.ensureAuthenticated,Auth.userpemberikerja,function(req,res){
  addlowker.editlowkers(req,res);
});

// Edit update
router.post('/update/:id',Auth.ensureAuthenticated,Auth.userpemberikerja,function(req,res) {
  addlowker.update(req,res)
});

// Edit update addlowker
router.post('/delete/:id',Auth.ensureAuthenticated,Auth.userpemberikerja,function (req,res){
  addlowker.delete (req,res);
});


router.get('/login', function (req,res,next){

  res.render('../views/pemberikerja/login.ejs')
  //res.render("../views/pemberikerja/profiluser.ejs",{pemberikerja:pemberikerja})
});
router.get('/signup', function (req,res,next){
  res.render('pemberikerja/signup.ejs')
});
router.post('/signup', function (req, res,next){
  var username = req.body.username;
  var password = req.body.password;
  var perusahaan = req.body.lembaga;
  var alamat = req.body.alamat;
  var notelepon = req.body.notelepon;
  var email = req.body.email;
  var deskrepsi = req.body.deskrepsi;


    Daftar.find({'login.email':req.param('email')}, function (err, user){
      if (user.length == 0)
      {
        var Pendaftaran = new Daftar ({
          'userpemberikerja':true,
          'login.username':username,
          'login.password':password,
          'login.email':email,
          'pemberikerja.perusahaan':perusahaan,
          'pemberikerja.alamat':alamat,
          'pemberikerja.notelepon':notelepon,
        //  'pemberikerja.emailpemberikerja':emailpemberikerja,
          'pemberikerja.deskrepsi':deskrepsi,
        });
        Daftar.createUser(Pendaftaran, function (err,user){
          if (err) {
            console.log(user);
            res.redirect('/pemberikerja/kesalahansisitem');
          }
          else {
              res.redirect('/pemberikerja/login');
          }
        });
      }
      else{
        res.render('../views/pemberikerja/signup.ejs',{msg: ' Email ini Telah Di Gunakan ,Gunakan Alamat Email lainnya'});
      }
    })

  });

router.post('/login',
  passport.authenticate('local',{successRedirect:'/pemberikerja/listinputlowker', failureRedirect:'/pemberikerja/login',failureFlash: true}),
  function(req, res,next) {

    res.redirect('/');
  });

router.get('/logout', function(req, res){
    req.session.destroy(function(err){
    if(err){
      console.log(err);
    }
    else
    {
      res.redirect('/pemberikerja');
    }
  });
});


//get user saat login
router.get('/profil/',Auth.ensureAuthenticated,Auth.userpemberikerja,function (req,res,err) {
  Daftar.findOne({}).exec(function (err){
    if (err){
      console.log("Error:", err);
    }
    else {
      res.render("../views/pemberikerja/profil.ejs",{profil:req.user})
    }
  });

});
//get user spesifik

router.get('/profil/user/:id',function (req,res) { //di lihat umum
    //addlowker.show(req,res);
    Daftar.findOne({_id: req.params.id}).exec(function (err , pemberikerja){
      if (err){
        console.log("Error:", err);
      }
      else {
        res.render("../views/pemberikerja/profiluser.ejs",{pemberikerja:pemberikerja})
      }
    });
});
// Edit update
router.post('/updateuser/:id',Auth.ensureAuthenticated,Auth.userpemberikerja,function(req,res) {
  addlowker.updateuser(req,res)
});


router.get('/datalistinputcv/', Auth.ensureAuthenticated,Auth.userpemberikerja,function (req,res,next){
//work db.ambilkerjas.find({"idlowker" : ObjectId("5a58ce35d6531920d7e11962")}).pretty()

  Input.find ({},function(err,lowkers){
    if (err){
        console.log("Error:", err);
    }
    //  Ambilkerja.find().where('pelamarkerja.id').equals(req.user._id).exec(function(err,listlamarkerja){
    Ambilkerja.find({'userpemberilowker.id':req.user._id}).sort([['createdAt',-1]]).exec(function(err,ambilkerja){
      if(err) {
        console.log("Error:", err);
      }
      res.render("../views/pemberikerja/dataambilkerja.ejs",{ambilkerja:ambilkerja,lowkers:lowkers})
    })

  })//nutup ambilkerja

  /*
   Ambilkerja.find( function (err, lowkers){
     if (err) {
       res.redirect("/");
     }
     Input.find().where('_id').equals(lowkers.idlowker).exec(function(err,ambilkerja){
      if (err) {
         res.redirect("/");
      }
      res.render("../views/pemberikerja/dataambilkerja.ejs",{ambilkerja:ambilkerja})
     })
  }); //menutup Input
  */
  // Ambilkerja.find().where('lowker.id').equals(req.user._id).exec(function (err, ambilkerja){
  //   if (err){
  //    res.redirect("/");
  //   }
  //  else {
  //    res.render("../views/pemberikerja/dataambilkerja.ejs",{ambilkerja:ambilkerja})
  //   }
  // });
});
router.get('/datalistinputcv/:id', Auth.ensureAuthenticated,Auth.userpemberikerja,function (req,res,next){
  addlowker.dataambilkerja(req,res);
});
// Edit update
router.post('/updateterimakerja/:id',Auth.ensureAuthenticated,Auth.userpemberikerja,function(req,res) {
  addlowker.updateterimakerja(req,res)
});
router.get('/ambilkerja/:id' ,Auth.ensureAuthenticated,Auth.userpemberikerja,function (req,res) {
  //addlowker.show(req,res);
  Input.findOne({_id: req.params.id}).exec(function (err , ambilkerja){
    if (err){
      console.log("Error:", err);
    }
    else {
      res.render("../views/pemberikerja/ambilkerja.ejs",{ambilkerja:ambilkerja})
    }
  });
});
router.get('/dataambilkerja/terimakerja/:id',Auth.ensureAuthenticated,Auth.userpemberikerja,function (req,res,next){
  Ambilkerja.findOne({_id: req.params.id}).where('userpemberilowker.id').equals(req.user._id).exec(function (err, ambilkerja){
    if (err){
      res.redirect("/");
    }
    else {
      res.render("../views/pemberikerja/editambilkerja.ejs",{ambilkerja:ambilkerja})
    }
  });
});


//get user saat Edit
router.get('/profil/user/edit/:id',Auth.ensureAuthenticated,Auth.userpemberikerja,function(req,res){
  addlowker.edituser(req,res);
});
// Edit update
router.post('/updateuser/:id',Auth.ensureAuthenticated,Auth.userpemberikerja,function(req,res) {
  addlowker.updateuser(req,res)
});



module.exports = router;
