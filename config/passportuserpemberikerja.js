var LocalStrategy = require('passport-local').Strategy;
var User = require('../database/userkerja');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',

    passReqToCallback: true,

  },
  function(req, username, password,done) {
    process.nextTick(function() {
      User.findOne({ 'login.username':  username }, function(err, user) {
        if (err)
            return done(err);
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That username is already in use.'));
        } else {
          var newUser = new User();
          newUser.login.username = username;
          newUser.login.password = newUser.generateHash(password);
          newUser.login.admin = true;
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, username, password, done) {
    User.findOne({ 'login.username':  username }, function(err, user) {
      if (err)
          return done(err);
      if (!user)
          return done(null, false, req.flash('loginMessage', 'No user found.'));
      if (!user.validPassword(password))
          return done(null, false, req.flash('loginMessage', 'Wrong password.'));
      return done(null, user);
    });
  }));
};

//move router/pemberikerja.js
/*
router.get('/login', function(req, res, next) {
  res.render('pemberikerja/login.ejs', { message: req.flash('loginMessage') });
});

router.get('/signup', function(req, res) {
  res.render('pemberikerja/signup.ejs', { message: req.flash('signupMessage') });
});

router.get('/profile',function(req, res ,next) {
  res.render('/pemberikerja/profile.ejs'  );
});



router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/pemberikerja/profile',
  failureRedirect: '/pemberikerja/signup',
  failureFlash: true,
}));

router.post('/login', function(req, res, next) {
  session_store = req.session;

  if (req.param('username') == ""  || req.param('password') == "")
  {
      req.flash('info', 'Form Harus Di isi');
      res.redirect('/pemberikerja/sa');
  }
  else
  {

      User.find({ 'login.username': req.param('username'),   }, function(err, masuk) {
      if (err) throw err;

      if (masuk.length > 0)
      {
          session_store.username = masuk[0].username;
          session_store.password = masuk[0].password;
          session_store.logged_in = true;

          res.redirect('/pemberikerja');
      }
      else
      {
          req.flash('info', 'Sepertinya akun Anda salah!');
          res.redirect('/pemberikerja/login');
      }

    });
  }
});
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
*/
