import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';
//---------------------------Local Strategy-------------------------------------
export default function(User) {
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, username, password, done) {
    if (!req.user) {
      User.findOrCreate({
        username: username,
        password: password
      })
      .then((user) => done(null, user))
      .catch((err) => done(err));
    } else {
      //user exists and is logged in
      done(null, false);
    }
  }));
  //---------------------------local login----------------------------------------
  passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, username, password, done) {
    let foundUser;
    return User.find({username: username})
      .then((user) => {
        if (user.length === 0) {
          return [false, user[0]];
        } else {
          foundUser = user[0];
          return User.isValidPassword(password, user[0].id);
        }
      })
      .then((match) => {
        if (match) {
          return done(null, foundUser);
        } else {
          return done(null, false);
        }
      })
      .catch((err) => done(err));
  }));
}
