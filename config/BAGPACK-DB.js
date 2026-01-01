const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/BAGPACK")
.then(()=>{
    console.log("your db server is live");
})
.catch(function(err){
    console.log(err);
})
module.exports = mongoose; 