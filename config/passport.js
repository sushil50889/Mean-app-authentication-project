var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require("./config");
const User = require("../model/model");

module.exports = (passport) => {
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromHeader("authorization");
opts.secretOrKey = config.secret;
// console.log(opts);
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    // console.log(jwt_payload);    
    User.findById(jwt_payload._id, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));

}