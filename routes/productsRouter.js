const express= require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const Products = require("../models/products")
router.post("/create",upload.single("image"),async (req,res)=>{
    try{
    let {name,price,discount,bgcolor,panelcolor,textcolor}= req.body;
    let product = await Products.create({
        images:req.file.buffer,
        name,
        price,
        discount,
        bgcolor,
        panelcolor,
        textcolor
    })
    req.flash("success","product created successfully");
    res.redirect("/owners/products");
}
catch (err){
    res.send(err.message);
}
});
module.exports = router;