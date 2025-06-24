
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const Admin = require("./models/admin");
const User = require("./models/user");

// Admin local strategy
passport.use("admin-local", Admin.createStrategy());

// User local strategy
passport.use("user-local", User.createStrategy());

// Admin Google SSO
passport.use("google", new GoogleStrategy({
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
          googleId: profile.id,
          role: "admin"
        });
        await admin.save();
      }
    }
    return done(null, admin);
  } catch (err) {
    done(err, null);
  }
}));

// User Google SSO
passport.use("user-google", new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/user/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        user.googleId = profile.id;
        await user.save();
      } else {
        user = new User({
          username: profile.displayName,
          email,
          googleId: profile.id,
          role: "customer"
        });
        await user.save();
      }
    }
    return done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, { id: user._id, role: user.role });
});

passport.deserializeUser(async ({ id, role }, done) => {
  const Model = role === "admin" ? require("./models/admin") : require("./models/user");
  try {
    const user = await Model.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
