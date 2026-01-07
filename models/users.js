const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
    Full_Name: {
        type:String,
        minlength:3,
        trim: true
    },
    email:String,
    password:String,
    cart: [
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products"
    },
    quantity: {
      type: Number,
      default: 1
    }
  }
]
,
    orders:{
        type:Array,
        default:[]
    },
    contact:Number,
    picture:String,
    createdAt: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model("Users",UserSchema); 