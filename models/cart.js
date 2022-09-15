const { Schema,model }  = require("mongoose");

const cartSchema = new Schema({
    userId:{type:String,required:true,unique:true},
    product:[{
      productId:{type:String,required:true},
      quantity:{type:Number,required:true},
      color:{type:Number,required:true},
      size:{type:Number,required:true},
  }]
})

module.exports = model("cart",cartSchema);