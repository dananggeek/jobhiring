var mongoose= require('mongoose');
var Schema= mongoose.Schema;

var UserWebContentManager=new Schema({
  NamaPengguna:String,
  password:{type: String, require:true},
  NamaDepan: String,
  NamaBelakang: String,
  admin: Boolean,

},
{
  timestamps: true
});

var UserWebContentManager=mongoose.model('UserWebContentManager',UserWebContentManager);
module.exports = UserWebContentManager;
