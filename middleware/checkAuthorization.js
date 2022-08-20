const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;

module.exports = {
  checkAuth: async (req, res, next) => {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      res.status(401).json({
        message: "You're unauthorized",
      });
    }
    const token = bearerToken.split(" ")[1];
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
  },
};
