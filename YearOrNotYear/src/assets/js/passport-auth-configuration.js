const passport = require('passport');
const Office365 = require('passport-azure-ad-oauth2');

passport.use(
  new Office365({
      clientID: '{95472e9f-d8d2-4277-b1c6-7aa02b3e4e07}',
      clientSecret: '{cBbgBO6C2/DVCQGCNmE8zMXj76m4vJzrf1uFSyV5QgQ=}',
      callbackURL: 'http://localhost:4200/dashboard'
    },
    function (accessToken, refresh_token, params, profile, done) {
      //var waadProfile = profile || jwt.decode(params.id_token, '', true);
      console.log(accessToken);

      User.findOrCreate({id: waadProfile.upn}, function (err, user) {
        done(err, user);
      });
    }));
