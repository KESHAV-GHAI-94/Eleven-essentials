const Users = require("../models/users")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const {generateToken} = require("../utils/generatetoken");
const Products = require("../models/products");
// create user
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
//initial page setup
module.exports.loginpage = (req,res)=>{
    let error = req.flash("error");
    let success = req.flash("success");
    res.clearCookie("token");
    res.clearCookie("connect.sid");
    res.render("index",{error,success,isloggedin:false});
};
//addmore product
module.exports.addmore = async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.user.email });

    const existingItem = user.cart.find(
      item => item.product && item.product.toString() === req.params.productid
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cart.push({
        product: req.params.productid,
        quantity: 1
      });
    }
    await user.save();
    req.flash("success", "Product added to cart");
    res.redirect("/shop");
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong");
    res.redirect("/shop");
  }
};
// user login
module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      req.flash("error", "Email and password are required");
      return res.redirect("/");
    }

    const user = await Users.findOne({ email });
    if (!user) {
      req.flash("error", "User not found. Please sign up first.");
      return res.redirect("/");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash("error", "Invalid credentials");
      return res.redirect("/");
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false  
    });

    return res.redirect("/shop");

  } catch (err) {
    console.error("LOGIN ERROR ", err);
    req.flash("error", "Login failed");
    return res.redirect("/");
  }
};
// user fetching cart 
module.exports.cartdata =async (req, res) => {
  const user = await Users
    .findOne({ email: req.user.email })
    .populate("cart.product");
    console.log(user.cart);
      let totalMRP = 0;
      let totalDiscount = 0;
      const pffee= 20;
      user.cart.forEach(cart => {
        if (cart.product) {
            totalMRP += cart.product.price * cart.quantity;
            totalDiscount += (cart.product.discount * cart.product.price * cart.quantity) / 100;
          }});
          const bill = totalMRP-totalDiscount+pffee;
  res.render("cart", { user,totalMRP,totalDiscount,bill});
};
//shop page for login user
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
// logout api
module.exports.logout = (req, res) => {
    res.clearCookie("token", {
  httpOnly: true,
  path: "/"
});
 
    res.clearCookie("owner_token");
    req.flash("success", "Logged out successfully");
    res.redirect("/");
};
