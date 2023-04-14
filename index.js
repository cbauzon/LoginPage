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
    res.render("login", {incorrect: 0});
})

app.post("/", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    let incorrect = 0;

    User.find({email: email}).then((foundUsers) => {
        console.log(foundUsers);

        // Logic for checking for user and password
        if (foundUsers.length === 1 && foundUsers[0].password === password) {
            console.log("Correct");
        } else {
            incorrect = 1;
            console.log("Incorrect");
            res.render("login", {incorrect: incorrect});
        }
        
    });

});


app.listen(process.env.PORT || 3000, () => {
    console.log("Server is up!");
});