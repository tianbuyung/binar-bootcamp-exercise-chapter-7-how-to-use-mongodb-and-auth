const checkUserRole = (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    res.send("You are writer");
  }
};

module.exports = checkUserRole;
