const { Schema, model } = require("mongoose");

const reviewsSchema = new Schema({
    review: { type: String, required: true,unique:true },
    name: { type: String, required: true },
    company: { type: String, required: true },
    link: { type: String, required: true }
});


module.exports = model("reviews", reviewsSchema);
