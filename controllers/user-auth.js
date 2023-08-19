exports.getRegister = (req, res, next) => {
  res.render("sign-in.ejs", {
    pageTitle: "Register",
  });
};

exports.getLogin = (req, res, next) => {};
