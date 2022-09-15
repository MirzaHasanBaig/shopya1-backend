const { Schema,model }  = require("mongoose");

const licenseSchema = new Schema({
    username:{type: String,required: true,unique: true},
    type:{type: String,required: true},
    duration:{type: Number,required: true},
    token:{type: String,required: true},
    status:{type: String,default: "disabled"}
},{timestamps:true})

module.exports = model("license",licenseSchema);