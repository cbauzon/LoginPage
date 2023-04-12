/* Libraries Used */
const express = require("express"),
    mongoose = require("mongoose");




const app = express();
app.use(express.urlencoded({extended: true}));     
app.use(express.static("public"));      // all static elements stored in public
app.set("view engine", "ejs");          // using ejs as view engine


app.get("/", (req, res) => {
    res.render("login");
})

app.post("/", (req, res) => {

});



app.listen(process.env.PORT || 3000, () => {
    console.log("Server is up!");
});