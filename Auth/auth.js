
var Auth = {
    check_login: function (req, res, next)
    {
        if (!req.session.logged_in) {
            return res.redirect('/pencarikerja/login');
        }

        next();
    },

    is_admin: function (req, res, next)
      {
          if (!req.session.admin) {

              return res.redirect('/webcontenmanager/login');
          }

          next();
      },
    ensureAuthenticated :function (req, res, next){
    	if(req.isAuthenticated()){
    		return next();
    	} else {
    		//req.flash('error_msg','You are not logged in');
    		res.redirect('/pemberikerja/login');
    	}
    },
    loginpencarikerja :function (req, res, next){
    	if(req.isAuthenticated()){
    		return next();
    	} else {
    		res.redirect('/pencarikerja/login');
    	}
    },

    userpencarikerja: function(req, res, next) {
      if(req.user.userpencarikerja) {
        next();
      } else {
        res.redirect('/pencarikerja/login');
      }
    },
    userpemberikerja: function(req, res, next) {
      if(req.user.userpemberikerja) {
        next();
      } else {
        res.redirect('/pemberikerja/');
      }
    },

};


module.exports = Auth;
