var mongoose =require('mongoose');
var crypto= require('crypto');

var secret = 'sukasuka';

var password= crypto.createHmac('sha256',secret)
                  .update('terserahdanang01')
                  .digest('hex');



console.log("Password:"+password);


mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost/skripsi');

var User = require('../database/webmanager');

User.find({NamaPengguna:'admindanang'}, function (err,user){
//User.find({username:'superadmin'}, function (err, user){
  if (user.length == 0)
  {

    var adminsatu = new User({
        NamaPengguna:'admindanang',
        password:password,
        NamaDepan: 'danang',
        NamaBelakang: 'wija',
        admin: true,

      });

    adminsatu.save(function(err) {
      if (err) throw err;

       console.log('Admin Kesatu berhasil di buat');
      });
    }
});
User.find({NamaPengguna:'admindanangdua'}, function (err,user){
  if (user.length == 0)
  {
    var admindua = new User({
        NamaPengguna:'admindanangdua',
        password:password,
        NamaDepan: 'wija',
        NamaBelakang: 'yanto',
        admin: true,

    });
    admindua.save(function(err){
      if (err) throw err;
      console.log('Admin Kedua berhasil di buat');
    });
  }
});
