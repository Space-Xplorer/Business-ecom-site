const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Admin = require("./models/admin");

passport.use(Admin.createStrategy());
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/admin/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let admin = await Admin.findOne({ googleId: profile.id });

    if (!admin) {
      admin = await Admin.findOne({ email });
      if (admin) {
        admin.googleId = profile.id;
        await admin.save();
      } else {
        admin = new Admin({
          username: profile.displayName,
          email,
          googleId: profile.id
        });
        await admin.save();
      }
    }

    return done(null, admin);
  } catch (err) {
    done(err, null);
  }
}));
