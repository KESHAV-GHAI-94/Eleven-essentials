const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const jwt = require("jsonwebtoken");
// databases
const BAGPACK = require("./config/BAGPACK-DB");
const Products = require("./models/products");
const  Users = require("./models/users");
const Owners = require("./models/owners");
const ownerRouter=require("./routes/ownersRouter");
const userRouter=require("./routes/usersRouter");
const productsRouter=require("./routes/productsRouter");

//middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
// to routers
app.use("/owners",ownerRouter);
app.use("/products",productsRouter);
app.use("/users",userRouter);

// set ejs file
app.set("view engine","ejs");

app.get("/",(req,res)=>{
    res.send("happy new year");
});
// running server port
app.listen(3000,()=>{
    console.log("your server is running on localhost:3000");
});