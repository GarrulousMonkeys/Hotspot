import { Strategy as FacebookStrategy } from 'passport-facebook';
import passport from 'passport';

const FB = {
  APP_ID: process.env.FACEBOOK_APP_ID || 0,
  APP_SECRET: process.env.FACEBOOK_APP_SECRET || 0,
  //old CALLBACK: 'https://hotspot-app.herokuapp.com/auth/facebook/callback'
  CALLBACK: 'https://peaceful-inlet-24252.herokuapp.com/auth/facebook/callback'
};

console.log(FB);
export const facebookAuthConfig = function(User) {
  passport.use(new FacebookStrategy({
    clientID: FB.APP_ID,
    clientSecret: FB.APP_SECRET,
    callbackURL: FB.CALLBACK,
    enableProof: true,
    profileFields: ['id', 'emails', 'name']
  }, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      return User.findOrCreate({
        name: profile.name.givenName,
        facebookId: profile.id,
        facebookAccessToken: accessToken
      })
      .then((user) => {
        console.log('got it!');
        return done(null, user);
      })
      .catch((err) => done(err, null));
    });
  }
  ));
};
