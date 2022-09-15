const { Schema, model } = require("mongoose");

const cateSchema = new Schema({
    name: { type: String, required: true },
    faIcon: { type: String, required: true },
    image: { type: String, required: true },
    subcategories: { type: Array, required: true }
})

module.exports = model("categories", cateSchema);
