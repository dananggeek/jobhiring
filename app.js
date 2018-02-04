var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
//var pemberikerja = require('./routes/pemberikerja');

var flash =require('express-flash');
var session=require('express-session');
var mongoose=require('mongoose');
var expressValidator = require('express-validator');
var LocalStrategy = require('passport-local').Strategy;
var connectflash = require('connect-flash');
var passport = require('passport');
var methodOverride = require('method-override');
var webcontenmanager = require('./routes/webcontenmanager');
var pencarikerja = require('./routes/pencarikerja');
var pemberikerja = require('./routes/pemberikerja');
var multer = require('multer');
var routes = require('./routes/index');
var users = require('./routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.engine('handlebars', exphbs({defaultLayout:'views'}));


//app.set('view engine', 'hbs');
//app.engine('hbs', hbs({extname:'hbs' , defaultviews: 'views', viewsDir:__dirname+'./views/'}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use(session({secret:"terserah12345"}));
app.use(session({secret: 'terserah12345', resave: true,saveUninitialized: true}));
app.use(flash());
 // global vars
/* app.use(function (req, res, next){
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.error = req.flash('error');
 });
app.use(expressValidator({
  errorFormatter : function (param, msg , value){
    var namaspace = param.split('.')
    , root = namaspace.shift()
    ,formParam =root;

    while(namaspace.length){
      formParam += '[' +namaspace.shift()+']';
    }
    return {
      param : formParam,
      msg :msg ,
      value :value
    };
  }
}));
*/
app.use(passport.initialize());
app.use(passport.session());
app.use(connectflash());
app.use(expressValidator())
app.use(methodOverride(function(req, res){
    if (req.body && typeof req.body == 'object' && '_method' in req.body)
    {
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

app.use('/', routes);
app.use('/users', users);
app.use('/pemberikerja', pemberikerja);
app.use('/webcontenmanager', webcontenmanager);
app.use('/pencarikerja', pencarikerja);


//seting dengan database user //
var webmanager=require('./database/webmanager');
var userpencarikerja=require('./database/userpencarikerja');
var User =require('./database/userkerja');
var ambilkerja =require('./database/ambilkerja');
//seting dengan database addlowker //
var addlowker=require('./database/addlowker');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url, {
    useMongoClient: true,
}); // connect to our database

/*
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);
mongoose.connect('mongodb://'+ (process.env.DB_PORT_27017_TCP_ADDR || process.env.MONGODB) + '/skripsi');

var promise = mongoose.connect('mongodb://localhost/skripsi', {
  useMongoClient: true,

});
var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url, {
    useMongoClient: true,
}); // connect to our database
*/


require('./config/passportpencarikerja')(passport);
require('./config/passportuserpemberikerja')(passport);
require('./config/passport')(passport);
// Passport Middleware
app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});
//ahir seting database //
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Halaman Tidak Di Temukan');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.ejs', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error.ejs', {
    message: err.message,
    error: {}
  });
});


 
module.exports = app;
