var mongoose =require('mongoose');
var crypto= require('crypto');

var secret = 'sukasukapencarikerja';

var password= crypto.createHmac('sha256',secret)
                  .update('userpencarikerja1')
                  .digest('hex');



console.log("Password:"+password);


mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost/skripsi');

var User = require('../database/UserPencariKerja');

User.find({UserPencariKerja:'User01'}, function (err,user){
//User.find({username:'superadmin'}, function (err, user){
  if (user.length == 0)
  {

    var user = new User({
        UserPencariKerja:'User01',
        NamaDepan:'User',
        NamaBelakangn:'Anu',
        password:password,
        EmailPencariKerja:'coba@gmail.com',

      });

    user.save(function(err) {
      if (err) throw err;

       console.log('UserPencariKerja berhasil di buat');
      });
    }
});
