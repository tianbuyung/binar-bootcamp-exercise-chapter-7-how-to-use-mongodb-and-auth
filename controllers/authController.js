const AuthService = require("../services/authService");
const authService = new AuthService();

class AuthController {
  async register(req, res) {
    const payload = req;
    const [error, register] = await authService.register(payload);
    if (error) {
      res.status(400).json({
        message: error,
      });
    } else {
      res.status(200).json({
        message: "Successfully register user.",
        register,
      });
    }
  }
  async login(req, res) {
    const payload = req;
    const [error, login] = await authService.login(payload);
    if (error) {
      res.status(400).json({
        message: error,
      });
    } else {
      res.status(200).json({
        message: "Successfully login into web.",
        login: `Bearer ${login}`,
      });
    }
  }
}

module.exports = AuthController;
