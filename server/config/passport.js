const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://civic-issue-reporter-c7du.onrender.com/api/auth/google/callback",
    },

    async (accessToken, refreshToken, profile, done) => {
      try {

        const email = profile.emails[0].value;

// Check if user already exists by email
let user = await User.findOne({ email });

if (!user) {

  // Create new user if email not found
  user = await User.create({
    googleId: profile.id,
    name: profile.displayName,
    email: email,
    role: "user",
    isVerified: true
  });

} else {

  // If user exists but doesn't have googleId yet
  if (!user.googleId) {
    user.googleId = profile.id;
    await user.save();
  }

}
        return done(null, user);

      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {

  const user = await User.findById(id);
  done(null, user);

});

module.exports = passport;