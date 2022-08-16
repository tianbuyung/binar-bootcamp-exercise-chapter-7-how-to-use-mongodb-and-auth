const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/authController");
const authController = new AuthController();

/* POST register. */
router.post("/register", authController.register);
/* POST login. */
router.post("/login", authController.login);

module.exports = router;
