const session     = require('express-session');
const mongo       = require('mongodb').MongoClient;
const passport    = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = function (app, db) {
  
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
      done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        db.collection('users').findOne(
            {id: id},
            (err, doc) => {
                done(null, doc);
            }
        );
    });
  
    function findOrCreateUser(accessToken, refreshToken, profile, cb) {
      db.collection('users').findAndModify(
              {id: profile.id},
              {},
              {$setOnInsert:{
                  id: profile.id,
                  name: profile.displayName || 'Anonymous',
                  // photo: profile.photos[0].value || '',
                  // email: profile.emails[0].value || 'No public email',
                  created_on: new Date(),
                  provider: profile.provider || '',
              },$set:{
                  last_login: new Date()
              },$inc:{
                  login_count: 1
              }},
              {upsert:true, new: true}, //Insert object if not found, Return new object after modify
              (err, doc) => {
                  return cb(null, doc.value);
              }
          );
    }

    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "https://game-reviews.glitch.me/auth/github/callback"
      },
      function(accessToken, refreshToken, profile, cb) {        
          findOrCreateUser(accessToken, refreshToken, profile, cb);
        }
    ));
  
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "https://game-reviews.glitch.me/auth/facebook/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        findOrCreateUser(accessToken, refreshToken, profile, done);
      }
    ));
  
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: "https://game-reviews.glitch.me/auth/google/callback"
      },
      function(accessToken, refreshToken, profile, cb) {
        findOrCreateUser(accessToken, refreshToken, profile, cb);
      }
    ));
  
}