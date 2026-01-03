const express= require("express");
const router = express.Router();
const owners = require("../models/owners");
if(process.env.NODE_ENV==="development"){
router.post("/create", async(req,res)=>{
    let owner = await owners.find();
    if(owner.length>0){
        return res
        .status(503)
        .send("You dont have permision to create an owner");
    }
    let {Full_Name,email,password}= req.body;
    let createdOwner =await owners.create({
        Full_Name,
        email,
        password,
    });
    res.send(createdOwner);
});
};

module.exports = router;