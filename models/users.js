const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
    Full_Name: {
        type:String,
        minlength:3,
        trim: true
    },
    email:String,
    password:String,
    cart:{
        type:Array,
        default:[]
    },
    orders:{
        type:Array,
        default:[]
    },
    contact:Number,
    picture:String
});
module.exports = mongoose.model("Users",UserSchema); 