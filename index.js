/* Libraries Used */
const express = require("express"),
    mongoose = require("mongoose"),
    session = require("express-session");

/* Setting up Mongoose */
mongoose.connect("mongodb://127.0.0.1:27017/loginPage");
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    status: Number
});
const User = mongoose.model("User", userSchema);

/* Setting up Express */
const app = express();
app.use(express.urlencoded({extended: true}));     
app.use(express.static("public"));      // all static elements stored in public
app.set("view engine", "ejs");          // using ejs as view engine

/* Global Variables */
let email = "";
let password = "";
let fullName = "";

/* Routes */
app.get("/", (req, res) => {
    console.log(req.session);
    res.render("login", {incorrect: 0});
});

app.get("/status", (req, res) => {
    if (email) {
        User.find({status: 1}).then((userList) => {
            res.render("status", {user: fullName, userList: userList});
        });
    } else {
        res.redirect("/");
    }
});

app.post("/logout", (req, res) => {
    User.updateOne({email: email}, {status: 0}).then(() => {
        console.log("Log out update successful for", email, "!");
    });
    res.redirect("/");
})

app.post("/", (req, res) => {
    email = req.body.email;
    password = req.body.password;

    authUser(email, password, res);
});


/* Helper Functions */
const authUser = (email, password, res) => {
    let incorrect = 0;

    User.find({email: email}).then((userList) => {
        console.log(userList);

        // Logic for checking for user and password
        if (userList.length === 1 && userList[0].password === password) {
            console.log("Correct");
            fullName = userList[0].name;
            User.updateOne({email: userList[0].email}, {status: 1}).then(() => {
                console.log("Update successful!");
            });
            res.redirect("/status");
        } else {
            incorrect = 1;
            console.log("Incorrect");
            res.render("login", {incorrect: incorrect});
        }
        
    });
}


/* Start App */
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is up!");
});