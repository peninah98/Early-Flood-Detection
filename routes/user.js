const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/user");
const userProtector = require("../middlewares/user-protect");

router.get("/", userProtector.userAuth, userControllers.getIndex);

module.exports = router;