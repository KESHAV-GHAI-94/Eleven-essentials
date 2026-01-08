const express= require("express");
const router = express.Router();
const Products= require("../models/products");
const {shopPage,logout} = require("../controllers/AuthController");
const owners = require("../models/owners");
const Users = require("../models/users")
const isloggedin= require("../middleware/isloggedin")
router.get("/",(req,res)=>{
    let error = req.flash("error");
    let success = req.flash("success");
    res.clearCookie("token");
    res.clearCookie("connect.sid");
    res.render("index",{error,success,isloggedin:false});
})
router.get("/shop",shopPage)
router.get("/logout",logout);
router.get("/cart",isloggedin,async (req,res)=>{
    res.render("cart")
})
router.get("/addtocart/:productid", isloggedin, async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.user.email });

    // prevent duplicates
    if (!user.cart.includes(req.params.productid)) {
      user.cart.push(req.params.productid);
      await user.save();
      req.flash("success", "Product added to cart");
    } else {
      req.flash("error", "Product already in cart");
    }

    res.redirect("/shop");
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong");
    res.redirect("/shop");
  }
});



module.exports = router;