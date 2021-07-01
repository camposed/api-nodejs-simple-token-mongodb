// Configure the Bearer strategy for use by Passport.
//
// The Bearer strategy requires a `verify` function which receives the
// credentials (`token`) contained in the request.  The function must invoke
// `cb` with a user object, which will be set at `req.user` in route handlers
// after authentication.

passport.use(new Strategy(
    function(token, cb) {
      db.users.findByToken(token, function(err, user) {
        if (err) { return cb(err); }
        if (!user) { return cb(null, false); }
        return cb(null, user);
      });
    })); 


  // curl -v -H "Authorization: Bearer 123456789" http://127.0.0.1:3000/
// curl -v http://127.0.0.1:3000/?access_token=123456789
 ruta.get('/',
 passport.authenticate('bearer', { session: false }),
 function(req, res) {
   res.json({ username: req.user.username, email: req.user.emails[0].value });
 });    