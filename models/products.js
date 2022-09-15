const { Schema, model } = require("mongoose");

const productSchema = new Schema({
    PL: { type: Number, default:0 },
    title: { type: String, required: true },
    base: { type: String, default:"common"},
    creatorid: { type: String, required: true },
    descrip: { type: String, required: true },
    image: { type: String, required: true },
    colors: { type: Array, required: true },
    sizes: { type: Array, required: true },
    category: { type: String, required: true },
    lowPrice: { type: Number, required: true },
    avialablity: { type: Boolean, default: true },
    prices: { type: Number, required: false },
    tags: { type: String, required: false },
}, { timestamps: true })

module.exports = model("product", productSchema);
