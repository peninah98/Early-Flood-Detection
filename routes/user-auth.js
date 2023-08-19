const express = require("express")
const router = express.Router()

const userAuthControllers = require("../controllers/user-auth")

router.get("/register", userAuthControllers.getRegister)
router.get("/login", userAuthControllers.getLogin)

module.exports = router