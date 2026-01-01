const mongoose = require("mongoose");
const OwnerSchema = mongoose.Schema({
    Full_Name: {
        type:String,
        minlength:3,
        trim: true
    },
    email:String,
    password:String,
    products:{
        type:Array,
        default:[]
    },
    contact:Number,
    picture:String,
    gstin:String
});
module.exports = mongoose.model("Owners",OwnerSchema); 