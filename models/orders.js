const { Schema, model } = require("mongoose");

const orderSchema = new Schema({
    userId: { type: String, required: true },
    products: [{
        productid: {type: String,required:true},
        quantity: { type: Number,required:true},
        color: { type: String,required:true},
        size: { type: String,required:true},
        lowPrice:{type: Number, required: true },
        status: { type: String, default:"pending" },
        review: { type: String, default:"pending" },
        star: { type: Number, default: 3 }
    }],
    Payment: { type: String, required: true },
    Shipping: { type: String, required: true },
    email: { type: String, required: true },
    amount:{ type: Number, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    ordernotes: { type: String},
    phone: { type: String, required: true },
    streetaddress1: { type: String, required: true },
    streetaddress2: { type: String },
    town: { type: String, required: true },
    zip: { type: String, required: true },
    Stoken: { type: String,unique:true, sparse: true },
    TID: { type: String,unique:true, sparse: true },
    Timage: { type: String,unique:true, sparse: true },
},
{timestamps:true}
);

module.exports = model("order", orderSchema);
