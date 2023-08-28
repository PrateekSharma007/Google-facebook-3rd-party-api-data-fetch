const express = require("express");
const app = express();
const passport = require("passport");
const user = require("./db/schema");
const db = require("./db/db");
const session = require("express-session");
require("dotenv").config();
require("./passport")




app.use(session({
    secret: "key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


app.use(passport.initialize());
app.use(passport.session());

//start

app.get("/", (req, res) => {
    res.send("Welcome to google auth");
});

//google auth

app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email'], prompt: 'select_account'}));

app.get("/auth/google/callback", passport.authenticate('google', { failureRedirect: "/auth/failure" }), (req, res) => {

    res.redirect("/check-registration");
});


//failure


app.get("/auth/failure", (req, res) => {
    res.send("User login failed");
});


// check 



app.get("/check-registration", async (req, res) => {
    if (req.isAuthenticated()) {
        const userEmail = req.user.email;
        const existingUser = await user.findOne({ email: userEmail });
        console.log(existingUser)
        console.log(userEmail)

        if (existingUser) {
            res.send("login successfull.");
        } else {
            res.send("User is not registered.");
        }
    } else {
        res.send("Not authenticated.");
    }
});



//logout

app.post('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });
  


app.listen(3000, () => {
    console.log("Port 3000 is working");
});
