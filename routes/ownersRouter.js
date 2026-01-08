const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/users");

const isOwner = require("../middleware/isOwner");
const owners = require("../models/owners");
const Products = require("../models/products");
if (process.env.NODE_ENV === "production") {
  router.post("/create", async (req, res) => {
    const existingOwner = await owners.find();
    if (existingOwner.length > 0) {
      return res.status(503).send("Owner already exists");
    }

    const { Full_Name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const owner = await owners.create({
      Full_Name,
      email,
      password: hash,
    });
    res.send(owner);
  });
}
/* OWNER LOGIN PAGE */
router.get("/", (req, res) => {
  res.render("owner-login", {
    error: req.flash("error"),
  });
});
/* OWNER LOGIN */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const owner = await owners.findOne({ email });
  if (!owner) {
    req.flash("error", "Invalid credentials");
    return res.redirect("/owners");
  }
  const match = await bcrypt.compare(password, owner.password);
  if (!match) {
    req.flash("error", "Invalid credentials");
    return res.redirect("/owners");
  }

  const token = jwt.sign(
    { id: owner._id, role: "owner" },
    process.env.JWT_KEY,
    { expiresIn: "1d" }
  );

  res.cookie("owner_token", token, {
    httpOnly: true,
    sameSite: "lax",
  });

  res.redirect("/owners/products");
});
router.get("/create",isOwner,(req,res)=>{
    let success =req.flash("sucess");
    res.render("createproducts",{success});
})

/* OWNER DASHBOARD */
router.get("/products", isOwner, async (req, res) => {
  const products = await Products.find();
  res.render("owneractions", { products });
});

/* DELETE PRODUCT */
router.post("/products/delete/:ProductId", isOwner, async (req, res) => {
  await Products.findByIdAndDelete(req.params.ProductId);
  res.redirect("/owners/products");
});

/* EDIT PRODUCT PAGE */
router.get("/products/edit/:ProductId", isOwner, async (req, res) => {
  const product = await Products.findById(req.params.ProductId);
  res.render("productedit", { product });
});

/* UPDATE PRODUCT */
router.post("/products/update/:ProductId", isOwner, async (req, res) => {
  const { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

  await Products.findByIdAndUpdate(req.params.ProductId, {
    name,
    price,
    discount,
    bgcolor,
    panelcolor,
    textcolor,
  });

  res.redirect("/owners/products");
});

/* LOGOUT */
router.get("/logout", (req, res) => {
  res.clearCookie("owner_token");
  res.clearCookie("connect.sid");
  res.redirect("/owners");
});
router.get("/users",isOwner, async (req, res) => {
  try {
    const users = await Users.find().sort({ createdAt: -1 });
    res.render("owners-users", { users });
  } catch (err) {
    console.error(err);
    res.send("Error loading users");
  }
});

module.exports = router;
