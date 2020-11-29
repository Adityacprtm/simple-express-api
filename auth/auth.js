const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const users = require("../db/users");
const generateToken = require("./generateToken");
const { signupValidation, loginValidation } = require("../db/validation");

// Auth Root Router
router.get("/", (req, res, next) => {
   res.json({
      message: "Welcome to Auth 🚀",
   });
});

// Auth Singup Router
router.post("/signup", async (req, res, next) => {
   // Validation
   let { error, value } = signupValidation(req.body);
   if (error) {
      res.statusCode = 400;
      next(new Error(error.details[0].message));
   } else {
      const user = await users.findOne({
         $or: [{ username: value.username }, { email: value.email }],
      });

      if (user) {
         res.statusCode = 400;
         next(new Error("email or username is taken 😭"));
      } else {
         const hashedPassword = bcrypt.hashSync(
            value.password,
            bcrypt.genSaltSync(10)
         );
         if (hashedPassword) {
            const insertUser = await users.insert({
               username: value.username,
               email: value.email,
               password: hashedPassword,
            });
            if (insertUser) {
               delete insertUser.password;
               const token = await generateToken(insertUser);
               if (token) {
                  const expiration = process.env.COOKIE_EXPIRATION;
                  res.cookie("token", token, {
                     expires: new Date(Date.now() + Number(expiration)),
                     secure: false,
                     httpOnly: true,
                  }).json({
                     user: insertUser,
                     token: token,
                  });
               } else {
                  res.statusCode = 400;
                  next(new Error("Whoops! Something went wrong 😭"));
               }
            } else {
               res.statusCode = 400;
               next(new Error("Error insert user. ⚠"));
            }
         } else {
            res.statusCode = 400;
            next(new Error("Error hash password. ⚠"));
         }
      }
   }
});

/* LOGIN ROUTER */
router.post("/login", async function (req, res, next) {
   // Validation
   const { error, value } = loginValidation(req.body);
   if (error) {
      res.statusCode = 400;
      next(new Error(error.details[0].message));
   } else {
      const user = await users.findOne({ username: value.username });
      if (user) {
         const match = await bcrypt.compare(value.password, user.password);
         if (match) {
            delete user.password;
            delete user._id;
            const token = await generateToken(user);
            if (token) {
               const expiration = process.env.COOKIE_EXPIRATION;
               res.cookie("token", token, {
                  expires: new Date(Date.now() + Number(expiration)),
                  httpOnly: true,
                  secure: false,
               }).json({
                  user: user,
                  token: token,
               });
            } else {
               res.statusCode = 400;
               next(new Error("Whoops! Something went wrong 😭"));
            }
         } else {
            res.statusCode = 400;
            next(new Error("Username & password not match! 🔑"));
         }
      } else {
         res.statusCode = 401;
         next(new Error("User does't exist. ⚠"));
      }
   }
});

module.exports = router;
