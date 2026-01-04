const jwt = require("jsonwebtoken");
const Users = require("../models/users");

module.exports = async (req, res, next) => {
    try {
        // ✅ cookies (plural)
        const token = req.cookies.token;

        if (!token) {
            req.flash("error", "You need to login first");
            return res.redirect("/");
        }

        // ✅ verify token
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        // ✅ use decoded.email
        const user = await Users.findOne({ email: decoded.email })
                                 .select("-password");

        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/");
        }

        req.user = user;
        next();

    } catch (err) {
        console.error(err);
        req.flash("error", "Invalid or expired token");
        return res.redirect("/");
    }
};
