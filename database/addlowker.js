var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var addlowker = new Schema({
//  perusahaan: { type: Schema.ObjectId, ref: 'userpemberilowker', required: true }, //reference to the associated book

    NamaPekerjaan: {type: String, index: true},
    JenisPekerjaan: String,
    Kemampuan:String,
    LokasiPekerjaan:String,
    Gaji: String,
    Tag: String,
    DeskrepsiPekerjaan:String,
    Email:String,
    Tag: String,
    author:{
         type: mongoose.Schema.Types.ObjectId,
         ref: "user"

    },
  },


{
    timestamps: true
});

var addlowker = mongoose.model('addlowker', addlowker);

module.exports = addlowker;
//idlowker.ambilkerja=id.input
