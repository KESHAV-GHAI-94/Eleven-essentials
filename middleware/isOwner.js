const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies?.owner_token;

  if (!token) {
    return res.redirect("/owners");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    if (decoded.role !== "owner") {
      return res.redirect("/owners");
    }

    req.owner = decoded;
    next();
  } catch (err) {
    return res.redirect("/owners");
  }
};
