const mongoose = require("mongoose");
const config = require("config");
const dbgr = require("debug")("development:mongoose");
console.log("MONGO_URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");})

module.exports = mongoose; 