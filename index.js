const express = require("express");
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const router = require("./route/createfood");
const liveserver = require("./route/liveserver");
const cors = require('cors');
const app = express();


mongoose.connect("mongodb+srv://new_db:newdb1902@cluster0.9ll3qel.mongodb.net/Foodie"
).then(() => console.log("Db Connected")).catch(()=> console.log("Database error"));
app.use(cors())
app.use(express.json());
app.use("/route",router);
app.route("/").get((req,res)=>{
res.json("hello world");
});



app.listen(port, "0.0.0.0",()=>{
    console.log("running in at "+port)
})