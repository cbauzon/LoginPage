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
    status: Number,
});
const User = mongoose.model("User", userSchema);

/* Setting up Express */
const app = express();
app.use(express.urlencoded({extended: true}));     
app.use(express.static("public"));      // all static elements stored in public
app.use(express.json());
app.use(session({
    secret: "watermelon",
    resave: false,
    saveUninitialized: true
}));
app.set("view engine", "ejs");          // using ejs as view engine


/* Routes */
app.get("/", (req, res) => {
    res.render("login", {incorrect: 0});
});

app.post("/", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    authUser(email, password, req, res);
});

app.get("/status", async (req, res) => {
    
    if (req.session.userID) {
        // console.log(req.session);
        try {
            const user = await User.find({_id: req.session.userID});
            if (user[0].status) {
                const userList = await User.find({status: 1});
                res.render("status", {
                    userName: req.session.name,
                    userList: userList 
                });
            } else {
                res.redirect("/")
            }
        } catch (err) {
            console.log(err);
        }

    } else {
        res.redirect("/");
    }
});

app.post("/logout", (req, res) => {
    User.updateOne({_id: req.session.userID}, {status: 0}).then(() => {
        console.log("Log out update successful for", req.session.name + "!");
    });
    res.redirect("/");
})

// app.post("/os-info", (req, res) => {
//     const osInfo = req.body;
//     User.updateOne({_id: req.session.userID}, {
//         os: osInfo.platform
//     });
//     res.redirect("/status");
// })


/* Helper Functions */
const authUser = (email, password, req, res) => {

    User.find({email: email}).then((userList) => {
        // console.log(userList);

        // Logic for checking for user and password
        if (userList.length === 1 && userList[0].password === password) {
            req.session.userID = userList[0]._id;
            req.session.name = userList[0].name;
            req.session.email = userList[0].email;

            User.updateOne({_id: req.session.userID}, {
                status: 1
            }).then(() => {
                console.log("User " + req.session.name + " is now online!");
            });
            res.redirect("/status");
        } else {
            console.log("Incorrect");
            res.render("login", {incorrect: 1});
        }
        
    });
}



/* Start App */
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is up!");
});