const { Schema,model }  = require("mongoose");

const userSchema = new Schema({
    username:{type: String,required: true,unique: true},
    name:{type: String,required: true},
    email:{type: String,required: true,unique: true},
    password:{type: String,required: true},
    phone:{type: String,required: true,unique: true},
    address:{type: String},
    logoimage: { type: String },
    Banimage: { type: String},
    enabled: { type: Boolean,default:true},
    isadmin:{type: Boolean,default: false},
    ACCtitle:{type: String},
    IBAN:{type: String},
    usertype:{
        type: String,default: "customer"
    }
},{timestamps:true})

module.exports = model("user",userSchema);