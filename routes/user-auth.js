const User = require("../models/user");
const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const userAuthControllers = require("../controllers/user-auth");
const userProtector = require("../middlewares/user-protect");

router
  .get("/register", userProtector.userNotAuth, userAuthControllers.getRegister)
  .post(
    "/register",
    userProtector.userNotAuth,
    [
      body("full_name", "Full name is required")
        .trim()
        .notEmpty({ ignore_whitespace: true }),
      body("email")
        .trim()
        .notEmpty({ ignore_whitespace: true })
        .withMessage("e-mail address is required")
        .isEmail()
        .withMessage("e-mail address is invalid")
        .custom((value) => {
          return User.findOne({ email: value.toLowerCase() }).then((user) => {
            if (user) {
              return Promise.reject("e-mail address ia already taken");
            }
          });
        }),
      body("password")
        .notEmpty({ ignore_whitespace: true })
        .withMessage("Password is required")
        .custom((value) =>
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-\#\$\.\%\&\@\!\+\=\\*]).{8,}$/g.test(
            value
          )
        )
        .withMessage("Password not strong enough"),
    ],
    userAuthControllers.postRegister
  )

  .get("/login", userProtector.userNotAuth, userAuthControllers.getLogin)
  .post(
    "/login",
    userProtector.userNotAuth,
    body("email").normalizeEmail({ all_lowercase: true }),
    userAuthControllers.postLogin
  )

  .get("/logout", userProtector.userAuth, (req, res, next) => {
    req.session.isUserLoggedIn = false;
    req.session.user = null;
    res.redirect("/auth/login");
  });

module.exports = router;
