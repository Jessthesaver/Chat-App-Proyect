import express from "express";
import passport from "passport";
import './auth/auth.js'
import pkg from 'jsonwebtoken'
const jwt=pkg
const router = express.Router()

router.post('/signup', 
    passport.authenticate('signup',{session:false}), async (req, res)=> {  
      return res.status(201).json({
            message: 'Succesfully signed in!',
            user: req.user,
        });
    }
)

router.post("/login", async (req, res, next) => {
    const authFunc = passport.authenticate("login", async (err, user, info) => {
      try {
        if (!user) {
          const error = new Error("INVALID_CREDENTIALS");
          return next(error);
        }
  
        if (err) {
          return next(err);
        }
  
        req.login(user, { session: false }, async (error) => {
          if (error) return next(error);
          const body = {
            id: user.id,
            username: user.username,
          };
          const token = jwt.sign({ user: body }, process.env.JWT_SECRET);
          return res.send({ token });
        });
      } catch (error) {
        return next(error);
      }
    });
    authFunc(req, res, next);
}); 

export { router as authRoute }