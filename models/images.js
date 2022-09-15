const { Schema, model } = require("mongoose");

const imagesSchema = new Schema({
    title: { type: String},
    desc: { type: String},
    tag: { type: String},
    image: { type: String, unique:true,required:true },
    link: { type: String, unique:true,required:true },
});


module.exports = model("images", imagesSchema);
