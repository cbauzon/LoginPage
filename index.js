/* Libraries Used */
const express = require("express"),
    mongoose = require("mongoose"),
    $ = require("jquery");

mongoose.connect("mongodb://127.0.0.1:27017/loginPage");
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});
const User = mongoose.model("User", userSchema);

const app = express();
app.use(express.urlencoded({extended: true}));     
app.use(express.static("public"));      // all static elements stored in public
app.set("view engine", "ejs");          // using ejs as view engine


app.get("/", (req, res) => {
    res.render("login");
})

app.post("/", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.find({email: email}).then((foundUsers) => {
        console.log(foundUsers);
        if (foundUsers.length != 0) {
            console.log("Found a user!");
        } else {
            console.log("Failed to find user :(");
        }
    });

    res.redirect("/");

});


app.listen(process.env.PORT || 3000, () => {
    console.log("Server is up!");
});