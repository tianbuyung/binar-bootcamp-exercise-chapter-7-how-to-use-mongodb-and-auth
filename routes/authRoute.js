const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/authController");
const authController = new AuthController();

const restrict = require("../middleware/checkAuthorization");

/* POST register. */
router.post("/register", authController.register);
/* POST login. */
router.post("/login", authController.login);
/* GET resend email verify. */
router.get(
  "/verify/resend-email",
  restrict.checkAuth,
  authController.resendEmailVerified
);
/* GET verify. */
router.get("/verify/:token", authController.verifiedUser);

module.exports = router;
