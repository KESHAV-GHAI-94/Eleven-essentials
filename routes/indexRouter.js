const express= require("express");
const router = express.Router();
const Products= require("../models/products");
const {shopPage,logout} = require("../controllers/AuthController");
const owners = require("../models/owners");
router.get("/",(req,res)=>{
    let error = req.flash("error");
    let success = req.flash("success")
    res.clearCookie(owners.token);
    res.render("index",{error,success});
})
router.get("/shop",shopPage);
router.get("/logout",logout)

module.exports = router;