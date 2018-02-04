var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ambilkerja = new Schema({
    status :String,
    datadiri:{
      namalengkap : String ,
      kelamin: String,
      tempat_lahir: String,
      tanggal_lahir: String,
      alamat_asal: String,
      alamat_tinggal: String,
      nohp: String,
      email : String,
      agama: String,
      foto:String,
    },
    pendidikan :{
      sma: String,
      jurusan_sma: String,
      kuliah: String,
      jurusan_kuliah: String,
    },
    pengalamankerja: String,
    pelamarkerja :{ //author
      id:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "user"
      },
      username: String,
    },
    userpemberilowker :{ //author
      id:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "user"
      },
      username: String,
    },

    idlowker:{
       type: mongoose.Schema.Types.ObjectId,
       ref: "addlowker"
    },


},
{
    timestamps: true
});

var ambilkerja = mongoose.model('ambilkerja', ambilkerja);

module.exports = ambilkerja;
