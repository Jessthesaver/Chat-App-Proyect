import authenticationModel from "../dbModel.js";
import passport from "passport";
import pkg from "passport-local";
import dotenv from "dotenv";
import strategyandextract from "passport-jwt";
const LocalStrategy = pkg.Strategy;
dotenv.config();
const Strategy = strategyandextract.Strategy;
const ExtractJWT = strategyandextract.ExtractJwt;

passport.use(
  new Strategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromBodyField("secret_token"),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  "signup",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        //authenticationModel.collection.dropIndexes();

        const user = await authenticationModel.create({ username, password });
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await authenticationModel.findOne({ username });
        if (!user) {
          return done(null, false, {
            error: "The user or password is incorrect",
            status: 404,
          });
        }

        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done(null, false, {
            error: "The user or password is incorrect",
            status: 404,
          });
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (err) {}
    }
  )
);
