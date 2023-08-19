module.exports.userAuth = (req, res, next) => {
  if (!req.session.isUserLoggedIn) {
    req.flash("error", "Login First!");
    return res.redirect("/auth/login");
  }
  next();
};

module.exports.userNotAuth = (req, res, next) => {
  if (req.session.isUserLoggedIn) {
    return res.redirect("/");
  }

  next();
};
