/* Libraries Used */
const express = require("express"),
    mongoose = require("mongoose");

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})



app.listen(process.env.PORT || 3000, () => {
    console.log("Server is up!");
});