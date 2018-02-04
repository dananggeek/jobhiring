router.get('/add', Auth_mdw.check_login, Auth_mdw.is_admin, function(req, res, next) {
    session_store = req.session;

    res.render('users/add', { session_store:session_store });
});

router.post('/add', Auth_mdw.check_login, Auth_mdw.is_admin, function (req, res, next){
    session_store = req.session;

    req.assert('username', 'Nama diperlukan').isAlpha().withMessage('Username harus terdiri dari angka dan huruf').notEmpty();
    req.assert('email', 'E-mail tidak valid').notEmpty().withMessage('E-mail diperlukan').isEmail();
    req.assert('firstname', 'Nama depan harus terdiri dari angka dan huruf').isAlpha();
    req.assert('lastname', 'Nama belakang harus terdiri dari angka dan huruf').isAlpha();

    var errors = req.validationErrors();
    console.log(errors);

    if (!errors)
    {
        v_username = req.sanitize( 'username' ).escape().trim();
        v_email = req.sanitize( 'email' ).escape().trim();
        v_firstname = req.sanitize( 'firstname' ).escape().trim();
        v_lastname = req.sanitize( 'lastname' ).escape().trim();
        v_admin = req.sanitize( 'admin' ).escape().trim();

        User.find({username:req.param('username')}, function (err, user){
            if (user.length == 0)
            {
                var admin = new User({
                    username: v_username,
                    email: v_email,
                    password: default_password,
                    firstname: v_firstname,
                    lastname: v_lastname,
                    admin: v_admin,
                });

                admin.save(function(err) {
                    if (err)
                    {
                        console.log(err);

                        req.flash('msg_error', 'Punten, sepertinya ada masalah dengan sistem kami...');
                        res.redirect('/users');
                    }
                    else
                    {
                        req.flash('msg_info', 'User berhasil dibuat...');
                        res.redirect('/users');
                    }
                });
            }
            else
            {
                req.flash('msg_error', 'Punten, username sudah digunakan...');
                res.render('users/add', {
                    session_store:session_store,
                    username: req.param('username'),
                    email: req.param('email'),
                    firstname: req.param('firstname'),
                    lastname: req.param('lastname'),
                });
            }
        });
    }
    else
    {
        // menampilkan pesan error
        errors_detail = "<p>Punten, sepertinya ada salah pengisian, mangga check lagi formnyah!</p><ul>";

        for (i in errors)
        {
            error = errors[i];
            errors_detail += '<li>'+error.msg+'</li>';
        }

        errors_detail += "</ul>";

        req.flash('msg_error', errors_detail);
        res.render('users/add', {
            session_store: session_store,
            username: req.param('username'),
            email: req.param('email'),
            firstname: req.param('firstname'),
            lastname: req.param('lastname'),
        });
    }

});

//////
#Tanya
Tadi googling tentang menu search dgn Nodejs,
dari semua script yang ku pahami hampir paham ,
yg ku tanyakan Maksud dari script 'gi' itu apa yaa,mohon penjelasanya bagi yang tau.
router.get('/search',function (req,res,next){
  if(req.query.search){
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Db.find({Tag:regex}).sort([['createdAt',-1]]).exec(function (err,...){
      if (err){
        console.log("Error:", err);
      }
      else {
        res.render('....ejs',{...:...});
      }
    });

  }else{
    .....}
