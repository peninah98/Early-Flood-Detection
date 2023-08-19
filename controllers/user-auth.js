const User = require("../models/user");

const { validationResult } = require("express-validator");
const { hash, compare } = require("bcryptjs");

exports.getRegister = (req, res, next) => {
  res.render("sign-up.ejs", {
    pageTitle: "Register",
  });
};

exports.postRegister = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error", [
      errors
        .array({ onlyFirstError: true })
        .map((err) => ({ message: err.msg, path: err.path })),
    ]);

    req.flash("obj", req.body);
    return res.redirect("/auth/register");
  }

  hash(req.body.password, 12)
    .then((hashedPassword) => {
      const userData = new User({
        names: req.body.full_name,
        email: req.body.email,
        password: hashedPassword,
      });

      return userData.save();
    })
    .then(() => res.redirect("/auth/login"))
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getLogin = (req, res, next) => {
  res.render("sign-in.ejs", {
    pageTitle: "Login",
  });
};

exports.postLogin = (req, res, next) => {
  const errors = validationResult(req);
  let isRedirected = false;
  if (!errors.isEmpty()) {
    req.flash("error", "Incorrect e-mail or password validate");
    req.flash("obj", req.body);
    isRedirected = true;
    return res.redirect("/auth/register");
  }

  let user;
  User.findOne({ email: req.body.email })
    .then((userData) => {
      if (!userData) {
        req.flash("error", "Incorrect e-mail or password email");
        req.flash("obj", req.body);
        isRedirected = true;
        return res.redirect("/auth/login");
      }

      user = userData;
      return compare(req.body.password, user.password);
    })
    .then((doMatch) => {
      if (!isRedirected) {
        if (!doMatch) {
          req.flash("error", "Incorrect e-mail or password pw");
          req.flash("obj", req.body);
          isRedirected = true;
          return res.redirect("/auth/login");
        }

        req.session.isUserLoggedIn = true;
        req.session.user = user;
        res.redirect("/");
      }
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
