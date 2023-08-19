exports.getRegister = (req, res, next) => {
  res.render("sign-up.ejs", {
    pageTitle: "Register",
  });
};

exports.getLogin = (req, res, next) => {
  res.render("sign-in.ejs", {
    pageTitle: "Login",
  });
};
