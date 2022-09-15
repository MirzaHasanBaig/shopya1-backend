const { Schema, model } = require("mongoose");

const blogsSchema = new Schema({
    title: { type: String, required: true,unique:true },
    creatorId: { type: String, required: true },
    description: { type: Array, required: true },
    tag: { type: Array, required: true },
    Date: { type: String, required: true },
    image:{ type: String, required: true }
},
{timestamps:true}
);


module.exports = model("blogs", blogsSchema);
