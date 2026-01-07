const Users = require("../models/users")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const {generateToken} = require("../utils/generatetoken");
const Products = require("../models/products");

module.exports.registerUser = async (req, res) => {
  try {
    const { email, password, Full_Name } = req.body;

    if (!email || !password || !Full_Name) {
      req.flash("error", "All fields are required");
      return res.redirect("/");
    }

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      req.flash("error", "User already exists with this email");
      return res.redirect("/");
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await Users.create({
      Full_Name,
      email,
      password: hash
    });

    req.flash("success", "Account created successfully. Please login.");
    res.redirect("/");

  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong. Try again.");
    res.redirect("/");
  }
};

module.exports.loginUser= async(req,res)=>{
    let {email,password} = req.body;
    if (!email || !password) { req.flash("error", "Email and password are required"); return res.redirect("/"); }
    let user = await Users.findOne({email});
    if(!user){
        req.flash("error", "User not found. Please sign up first.");
        return res.redirect("/");}
    bcrypt.compare(password,user.password,(err,result)=>{
        if(result){
            let token= generateToken(user);
            res.cookie("token", token, {
              httpOnly: true,
              path: "/"
            });
            res.redirect("/shop");
        }
        else{
            req.flash("error", "invalid credentials");
            return res.redirect("/");
        }
    })
}

module.exports.shopPage = async (req, res) => {
    try {
        const products = await Products.find();

        const success = req.flash("success");
        const error = req.flash("error");

        res.render("shop", {
            products,
            success,
            error,
            isloggedin: true,
            user: req.user || null
        });
    } catch (err) {
        console.error(err);
        req.flash("error", "Error loading shop page");
        res.redirect("/");
    }
};

module.exports.logout = (req, res) => {
    res.clearCookie("token", {
  httpOnly: true,
  path: "/"
});
 
    res.clearCookie("owner_token");
    req.flash("success", "Logged out successfully");
    res.redirect("/");
};
