const jwt = require("jsonwebtoken");

class CheckAuthorization {
  async #secretKey() {
    const secretKey = process.env.JWT_SECRET_KEY;
    return secretKey;
  }
  checkAuth = async (req, res, next) => {
    const token = req?.headers?.authorization.split(" ")[1];
    const secretKey = await this.#secretKey();
    if (!token) {
      res.status(401).json({
        message: "Session expired",
      });
    } else {
      jwt.verify(token, secretKey, function (err, decoded) {
        if (err) {
          return res.json({
            message: "Token not valid",
          });
        }
        req.user = decoded;
        next();
      });
    }
  };
}

module.exports = CheckAuthorization;
