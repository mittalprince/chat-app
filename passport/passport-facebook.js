'use strict';

const passport = require('passport');
const User = require('../models/user');
const FacebookStrategy = require('passport-facebook').Strategy;
//const secret  = require('../secret/secretFile')

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new FacebookStrategy({
    clientID: process.env.FB_CLIENT_ID || '160555657994587',
    clientSecret: process.env.FB_CLIENT_SECRET || 'e7bd1d20584175543b95007fc65c9c6c',
    profileFields: ['email', 'displayName', 'photos'],
    callbackURL: 'https://intense-harbor-56610.herokuapp.com/auth/facebook/callback',
    passReqToCallback: true

}, (req, token, refreshToken, profile, done) => {

    User.findOne({facebook:profile.id}, (err, user) => {
        if(err){
            return done(err);
        }

        if(user){
            //console.log("user exist",user);
            return done(null, user);
        }else{
            const newUser = new User();
            newUser.facebook = profile.id;
            newUser.fullname = profile.displayName;
            newUser.username = profile.displayName;
            newUser.email = profile._json.email;
            newUser.userImage = 'https://graph.facebook.com/'+profile.id+'/picture?type=large';
            newUser.fbTokens.push({token:token});

            newUser.save((err) => {
                if(err){
                    return done(err)
                }
                //console.log(newUser);
                else{
                return done(null, newUser);
                }
            })
        }
    })
}));