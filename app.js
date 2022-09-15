//Requirement
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const port = 5000;

dotenv.config();

app.use(express.json());

mongoose.connect(process.env.mongoose_uri)
.then(()=>console.log("Successful Connection"))
.catch((err)=>{console.log(err)});

//Routes
const authRouter = require("./routers/authentication");
const userRouter = require("./routers/user");
const productRouter = require("./routers/product");
const cartRouter = require("./routers/cart");
const orderRouter = require("./routers/order");
const cateRouter = require("./routers/categories");
const stripeRouter = require("./routers/stripe");
const functionalityRouter = require("./routers/functionalities");


//Use
app.use(cors());
app.use("/auth",authRouter);
app.use("/users",userRouter);
app.use("/product",productRouter);
app.use("/cart",cartRouter);
app.use("/order",orderRouter);
app.use("/categories",cateRouter);
app.use("/stripe",stripeRouter);
app.use("/functionality",functionalityRouter);

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(process.env.PORT||3000, () => console.log(`app listening on port ${process.env.PORT}!`));
