const express= require("express");
const router = express.Router();
const {registerUser,loginUser,shopPage} = require("../controllers/AuthController")
router.get("/",(req,res)=>{
    res.send("hlo");
});
router.post("/register",registerUser);
router.post("/login",loginUser);


module.exports = router;