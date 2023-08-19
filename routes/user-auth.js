const express = require("express")
const router = express.Router()

const userAuthControllers = require("../controllers/user-auth")

router.get("/register", userAuthControllers.getRegister)

module.exports = router