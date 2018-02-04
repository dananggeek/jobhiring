var express = require('express');
var moment = require('moment');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Auth= require('../Auth/auth');
var userpencarikerja = require('../database/userkerja');
var Ambilkerja = require('../database/ambilkerja');
var Input= require('../database/addlowker');
var formidable = require('formidable');
var fs = require('fs');
var pagination = require('pagination');
var flash = require('express-flash');
var formidable = require('formidable');
var fs = require('fs');
var multer = require('multer');
var path = require('path');
var router = express.Router();
var addlowker = require ("../controller/addlowker.js");
var session_store;

router.get('/',function(req, res, next) {
  res.render('../views/pencarikerja/index.ejs')

});
router.get('/listlamarkerja',Auth.loginpencarikerja,Auth.userpencarikerja,function(req, res, next) {

  Ambilkerja.find().where('pelamarkerja.id').equals(req.user._id).sort([['createdAt',-1]]).exec(function(err,listlamarkerja){
    if (err){
      console.log("Error:", err);
    }
    else {
      res.render('../views/pencarikerja/listlamarkerja.ejs',{listlamarkerja:listlamarkerja})
    }
  })

});

router.get('/listlamarkerja/:id',function(req, res, next) {
  Ambilkerja.findOne({_id: req.params.id}).where('pelamarkerja.id').equals(req.user._id).exec(function(err,detaillistlamarkerja){
    if (err){
      console.log("Error:", err);
    }
    else {
      res.render('../views/pencarikerja/listlamarkerja_id.ejs',{detaillistlamarkerja:detaillistlamarkerja})
    }
  })
});

//Register
router.get ('/login', function (req, res , next){
  res.render('pencarikerja/login.ejs')
});
router.get ('/register', function (req, res , next){
  res.render('pencarikerja/register.ejs')

});

router.post('/register', function (req, res,next){
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  var nama = req.body.nama;
  var alamat = req.body.alamat;
  var kelamin = req.body.kelamin;

    userpencarikerja.find({'login.email':req.param('email')}, function (err, user){
      if (user.length == 0)
      {
        var Pendaftaran = new userpencarikerja ({
          'userpencarikerja':true,
          'login.username':username,
          'login.password':password,
          'login.email':email,
          'pencarikerja.nama':nama,
          'pencarikerja.alamat':alamat,
          'pencarikerja.kelamin':kelamin,
        });
        userpencarikerja.createUser(Pendaftaran, function (err,user){
          if (err) throw err;
          console.log(user);
          res.redirect('/pencarikerja/login');
        });
      }
      else{
        res.render('../views/pencarikerja/register.ejs',{msg: ' Email ini Telah Di Gunakan ,Gunakan Alamat Email lainnya'});
        //  res.render('../views/pencarikerja/listlamarkerja_id.ej
      }
    })

});
router.post('/login',
  passport.authenticate('local', {successRedirect:'/pencarikerja/profil', failureRedirect:'/pencarikerja/login',failureFlash: true,
  }),
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
      res.redirect('/pencarikerja');
    }
  });
});

//get user saat login
router.get('/profil/',Auth.loginpencarikerja,Auth.userpencarikerja,function (req,res,err) {
  userpencarikerja.findOne({userpencarikerja:true}).exec(function (err){
    if (err){
      console.log("Error:", err);
    }
    else {
      res.render("../views/pencarikerja/profil.ejs",{profil:req.user})
    }
  });

});

//get user spesifik
router.get('/profil/user/:id',function (req,res) {
  //addlowker.show(req,res);
  userpencarikerja.findOne({_id: req.params.id}).exec(function (err , profil){
    if (err){
      console.log("Error:", err);
    }
    else {
      res.render("../views/pencarikerja/profiluser.ejs",{profil:profil})
    }
  });
});
//get user saat Edit
router.get('/profil/edituserpencarikerja/:id',Auth.ensureAuthenticated,Auth.userpencarikerja, function(req,res){
  addlowker.edituserpencarikerja(req,res);
});
// Edit update
router.post('/updateuserpencarikerja/:id',function(req,res) {
  addlowker.updateuserpencarikerja(req,res)
});

//Ambil lowongan Kerja
router.get('/ambilkerja/:id' ,Auth.loginpencarikerja,Auth.userpencarikerja,function (req,res) {

  //addlowker.show(req,res);
  Input.findOne({_id: req.params.id}).exec(function (err , ambilkerja){
    if (err){
      console.log("Error:", err);
    }
    else {
      res.render("../views/pencarikerja/ambilkerja.ejs",{ambilkerja:ambilkerja})
    }
  });
});
router.post('/ambilkerja' ,Auth.loginpencarikerja,Auth.userpencarikerja,function (req, res,next){

  var namalengkap = req.body.namalengkap;
  var kelamin = req.body.kelamin;

  var tempat_lahir = req.body.tempat_lahir;
  var tanggal_lahir = req.body.tanggal_lahir;
  var alamat_asal = req.body.alamat_asal;
  var alamat_tinggal= req.body.alamat_tinggal;
  var nohp = req.body.nohp;
  var email = req.body.email;
  var agama= req.body.agama;
  var sma = req.body.pendidikan_sma;
  var jurusan_sma = req.body.jurusan_sma;
  var kuliah = req.body.kuliah;
  var jurusan_kuliah = req.body.jurusan_kuliah;
  var pengalamankerja =req.body.pengalamankerja;
  var idlowker = req.body.idlowker;
  var userpemberilowker =req.body.userpemberilowker;

    var lowker = new Ambilkerja({
      //'login.username':username,
          'status':'menunggu di proses',

          'datadiri.namalengkap' : namalengkap ,
          'datadiri.kelamin': kelamin,
          'datadiri.tempat_lahir': tempat_lahir,
          'datadiri.tanggal_lahir': tanggal_lahir,
          'datadiri.alamat_asal': alamat_asal,
          'datadiri.alamat_tinggal': alamat_tinggal,
          'datadiri.nohp': nohp,
          'datadiri.email' : email,
          'datadiri.agama': agama,

          'pendidikan.sma': sma,
          'pendidikan.jurusan_sma': jurusan_sma,
          'pendidikan.kuliah': kuliah,
          'pendidikan.jurusan_kuliah': jurusan_kuliah,

          'pengalamankerja':pengalamankerja,

          'pelamarkerja.id':req.user._id,
          'pelamarkerja.username':req.user.login.username,
          'idlowker':idlowker,
          'userpemberilowker.id':userpemberilowker,

    });
    lowker.save(function (err){
      if (err) throw err;
      console.log(err);
    });
    console.log(req.file);
    //req.flash('messages','Pendaftaran Berhasil');
    res.redirect("/pencarikerja/listlamarkerja");

});
//cari Tag ,  db.addlowkers.find( { Tag: { $regex: /css/ } } ) //{Tag: req.params.tag //carikerja?tag=css
router.get('/carikerja/:?/:Tag',Auth.loginpencarikerja,Auth.userpencarikerja,function(req,res){
  Input.find({ Tag: { $regex: /'req.params.Tag'/ } }).exec(function (err, carikerja){
    if (err){
      res.redirect("/");
    }
    else {
      res.render("../views/pencarikerja/carikerja.ejs",{carikerja:carikerja})
    }
  });
});


//unggah foto
// import multer
var multer = require('multer');
//var storage = multer({ dest:'./public/images/lamarkerja/', limits: {fileSize:1000000, files:1} });

var storage = multer.diskStorage({
  destination: './public/images/',
  filename : function (req ,file ,cb){
    cd (null,file.fieldname + '-' + Date.now() +
    path.extname(file.originalname));
  }
});

//upload gambar
var ambilkerja = multer ({
  storage: storage
}).single('foto');

function checkFileType(file ,cd){
  var filetypes = /png|jpg|jpeg/;
  var extname = filetypes.test(path.extname(file.originalname));
}
module.exports = router;
