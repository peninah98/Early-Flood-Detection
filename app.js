const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/user");

const app = express();
const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;

// MODULES
const bodyparser = require("body-parser");
const csrf = require("csurf");
const flash = require("connect-flash");
const path = require("path");
const session = require("express-session");
const mongo_store = require("connect-mongodb-session")(session);
const cookieparser = require("cookie-parser");
const compression = require("compression");
const morgan = require("morgan");
const helmet = require("helmet");

// ROUTES
const userAuthRoutes = require("./routes/user-auth");
const userRoutes = require("./routes/user");

// APP CONFIGURATIONS
const store = new mongo_store({
  uri: MONGO_URL,
  collection: "sessions",
});

app.set("view-engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cookieparser());
app.use(flash());
app.use(morgan("dev"));
app.use(
  session({
    secret: "l",
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(csrf());
app.use(compression());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use((req, res, next) => {
  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  let successMessage = req.flash("success");
  if (successMessage.length > 0) {
    successMessage = successMessage[0];
  } else {
    successMessage = null;
  }

  let returnObj = req.flash("obj");

  if (returnObj.length > 0) {
    returnObj = returnObj[0];
  } else {
    returnObj = null;
  }

  req.errorMessage = errorMessage;
  req.successMessage = successMessage;
  req.returnObj = returnObj;

  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findOne({ _id: req.session.user._id })
    .then((user) => {
      if (!user) {
        req.session.user = null;
        req.session.isUserLoggedIn = false;
        return next();
      }

      req.user = user;
      next();
    })
    .catch((err) => next(new Error(err)));
});

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();

  res.locals.errorMessage = req.errorMessage;
  res.locals.successMessage = req.successMessage;
  res.locals.returnObj = req.returnObj;

  next();
});

// ROUTES
app.use("/auth", userAuthRoutes);
app.use(userRoutes);

// DATABASE CONNECTION
mongoose.set("strictQuery", true);
mongoose
  .connect(MONGO_URL)
  .then(() => app.listen(PORT, () => console.log("Listening")))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
