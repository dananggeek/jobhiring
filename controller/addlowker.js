var express = require('express');
var mongoose = require("mongoose");
var Addlowker= require("../database/addlowker");
var User = require("../database/userkerja");
var Ambilkerja = require("../database/ambilkerja");
var Input = require("../database/addlowker");
//var Auth_mdw= require('../Auth/auth');
var session_store;
//var Addlowker=mongoose.database("addlowker");
var addlowkerContoller = {};
  //show list lowker
/*
  addlowkerContoller.list = function (req, res){
    session_store= req.session_store;
    Addlowker.find({}).exec(function (err,addlowkers){
      if (err){
        console.log("Error:", err);
      }
      else {
        res.render("../views/pemberikerja/home.ejs",{addlowkers:addlowkers,session_store:session_store });
      }
    });
  };

  //add show single lowker
  addlowkerContoller.show = function(req,res) {
    Addlowker.findOne({_id: req.params.id}).exec(function (err , addlowker){
      if (err){
        console.log("Error:", err);
      }
      else {
        res.render("../views/pemberikerja/show.ejs",{addlowker:addlowker})
      }
    });
  }
*/
  //add addlowker function
  addlowkerContoller.create =  function (req,res){
    session_store = req.session;
    res.render("../views/pemberikerja/create.ejs");
  };
  //add save addlowker
  addlowkerContoller.save = function (req, res){
    var addlowker = new Addlowker(req.body);

    addlowker.save(function (err){
      if (err){
        console.log(err);
        res.render("../views/pemberikerja/create.ejs");
      }else {
        //Addlowker.find({}) //ditambahi
        //  .populate('Post.postedBy') //ditambahi
        console.log("Berhasil Tambah Lowker");
        res.redirect("/pemberikerja/listinputlowker/");
      }
    });
  };

  //edit lowker
  addlowkerContoller.editlowkers = function (req, res){
    Addlowker.findOne({_id:req.params.id}).exec(function (err , addlowker){
      if (err) {
        console.log("Error:", err);
      }else {
        res.render("../views/pemberikerja/editlowkers.ejs", {addlowker: addlowker});
      }
    });
  };
  addlowkerContoller.update = function (req, res){
    Addlowker.findByIdAndUpdate(req.params.id,
      { $set: {
              NamaPekerjaan: req.body.NamaPekerjaan,
              Kemampuan:req.body.Kemampuan ,
              JenisPekerjaan:req.body.JenisPekerjaan ,
              LokasiPekerjaan:req.body.LokasiPekerjaan,
              Gaji:req.body.Gaji ,
              DeskrepsiPekerjaan:req.body.DeskrepsiPekerjaan ,
              Tag:req.body.Tag
      }},
      {new : true}, function (err,addlowker) {
        if (err){
          console.log(err);
          res.render("../views/pemberikerja/editlowkers.ejs", {addlowker: req.body});
        }else {
          res.redirect("/pemberikerja/show/"+addlowker._id);
        }


      }
    );
  };

  addlowkerContoller.delete = function (req , res){
    Addlowker.remove({_id:req.params.id} , function(err){
      if (err) {
        console.log (err);
      }
      else {
        console.log("lowongan kerja terhapus");
        res.redirect("/pemberikerja/listinputlowker");
      }
    });
  };
//edit userpemberikerja

addlowkerContoller.edituser = function (req, res){
  User.findOne({_id:req.params.id}).exec(function (err , user){
    if (err) {
      console.log("Error:", err);
    }else {
      res.render("../views/pemberikerja/edituser.ejs", {user: user});
    }
  });
};
addlowkerContoller.updateuser = function (req, res){
  User.findByIdAndUpdate(req.params.id,
    { $set: {
        'login.username' : req.body.username,
        'login.lembaga' : req.body.lembaga,
        'pemberikerja.perusahaan':req.body.alamat,
        'pemberikerja.alamat':req.body.alamat,
        'pemberikerja.notelepon' : req.body.notelepon,
        'pemberikerja.emailpemberikerja' : req.body.email,
        'pemberikerja.deskrepsi' : req.body.deskrepsi,

    }},
    {new : true}, function (err,user) {
      if (err){
        console.log(err);
        res.render("../views/pemberikerja/edituser.ejs", {user: req.body});
      }else {
        res.redirect("/pemberikerja/profil/");
      }

        //res.render("../views/pemberikerja/show.ejs",{addlowker:addlowker})


    }
  );
};
//Edit userpencarikerja
addlowkerContoller.edituserpencarikerja = function (req, res){
  User.findOne({_id:req.params.id}).exec(function (err , user){
    if (err) {
      console.log("Error:", err);
    }else {
      res.render("../views/pencarikerja/edituser.ejs", {user: user});
    }
  });
};
addlowkerContoller.updateuserpencarikerja = function (req, res){
  User.findByIdAndUpdate(req.params.id,
    { $set: {
        'login.username' : req.body.username,
        'login.email':req.body.email,
        'pencarikerja.nama' : req.body.nama,
        'pencarikerja.alamat':req.body.alamat,
        'pencarikerja.kelamin' : req.body.kelamin,


    }},
    {new : true}, function (err,user) {
      if (err){
        console.log(err);
        res.render("../views/pencarikerja/profil/edituser.ejs", {user: req.body});
      }else {
        res.redirect("/pencarikerja/profil/");
      }

        //res.render("../views/pemberikerja/show.ejs",{addlowker:addlowker})


    }
  );
};
/// Bagian Web contenManager
addlowkerContoller.hapus = function (req , res){
  Addlowker.remove({_id:req.params.id} , function(err){
    if (err) {
      console.log (err);
    }
    else {
      console.log("lowongan kerja terhapus");
      res.redirect("/webcontenmanager/datalowker");
    }
  });
};
addlowkerContoller.hapuspemberikerja = function (req , res){
  User.remove({_id:req.params.id} , function(err){
    if (err) {
      console.log (err);
    }
    else {
      console.log("lowongan kerja terhapus");
      res.redirect("/webcontenmanager/listpemberikerja");
    }
  });
};
addlowkerContoller.hapuspencarikerja = function (req , res){
  User.remove({_id:req.params.id} , function(err){
    if (err) {
      console.log (err);
    }
    else {
      console.log("lowongan kerja terhapus");
      res.redirect("/webcontenmanager/listpemberikerja");
    }
  });
};

//TERIMA kerja

addlowkerContoller.dataambilkerja = function (req, res){
  Input.find ({author:req.user._id},function(err,lowkers){
    if (err){
        console.log("Error:", err);
    }
    Ambilkerja.findOne({_id: req.params.id}).exec(function (err, ambilkerja){//.where('userpemberilowker.id').equals(req.user._id)
      if (err) {
        console.log("Error:", err);
      }else {
        res.render("../views/pemberikerja/detailambilkerja.ejs", {ambilkerja: ambilkerja,lowkers:lowkers});
      }
    });
  })

  /*
  Ambilkerja.findOne({_id: req.params.id}).where('userpemberilowker.id').equals(req.user._id).exec(function (err, ambilkerja){
    if (err){
      res.redirect("/");
    }
    else {
      res.render("../views/pemberikerja/detailambilkerja.ejs",{ambilkerja:ambilkerja})
    }
  });
  */
};
addlowkerContoller.updateterimakerja = function (req, res){
  Ambilkerja.findByIdAndUpdate(req.params.id,
    { $set: {
        status : req.body.status,
        //login.username' : req.body.username,
    }},
    {new : true}, function (err,ambilkerja) {
      if (err){
        console.log(err);
        res.render("../views/pemberikerja/detailambilkerja.ejs", {ambilkerja: req.body});
      }else {
        res.redirect("/pemberikerja/datalistinputcv/");
      }

        //res.render("../views/pemberikerja/show.ejs",{addlowker:addlowker})


    }
  );
};

module.exports=addlowkerContoller;
