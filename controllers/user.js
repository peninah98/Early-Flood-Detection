exports.getIndex = (req, res, next) => {
  res.render("dashboard.ejs", {
    pageTitle: "Dashboard",
  });
};
