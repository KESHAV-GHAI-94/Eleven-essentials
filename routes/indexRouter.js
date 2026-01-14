const express= require("express");
const router = express.Router();
const {loginpage} = require("../controllers/AuthController")
const {cartdata}= require("../controllers/AuthController");
const Products= require("../models/products");
const {shopPage,logout} = require("../controllers/AuthController");
const owners = require("../models/owners");
const Users = require("../models/users")
const isloggedin= require("../middleware/isloggedin")
const {addmore}= require("../controllers/AuthController")
router.get("/", loginpage);
router.get("/shop",shopPage)
router.get("/logout",logout);
router.get("/cart", isloggedin, cartdata);

router.get("/addtocart/:productid", isloggedin, addmore);
module.exports = router;