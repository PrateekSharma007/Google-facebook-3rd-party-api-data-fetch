const express = require("express");
const app = express() ;
const User = require("./db/schema")
const db = require("./db/schema")
const session = require("express-session")
const passport = require("passport")
const cookieparser = require("cookie-parser")
const movie = require("./db/schemaapi")
// const gettingdata = require('./container/api')
require("./passport")


app.use(express.json({limit : '5mb'}));
app.use(express.urlencoded({extended : true}));
app.use(cookieparser())


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure : false ,

    }
}))


app.use(passport.initialize())
app.use(passport.session())

// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile'] }));

// app.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/failure' ,successRedirect : "/protected"}),
 
// )
// app.get("/protected" , (req,res) => {
    
//         try {
//             if (req.isAuthenticated()) {
//                 const token = req.cookies.jwt;
//                 console.log(token)
//                 res.json({ authenticated: true, token });
//               } else {
//                 res.json({ authenticated: false });
//               }
//         } catch (error) {
//           console.error("An error occurred:", error);
//           res.status(500).send("Internal Server Error");
//         }
//       ;
      
// })
// app.get("/failure" , (req,res) => { 
//     res.send("login failed")
// })





//facebook 


app.get("/",(req,res) =>{
  res.send("ok")

})

app.get('/auth/facebook', passport.authenticate('facebook'));


app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/error'
  }));


app.get("/profile" ,(req,res)=>{
  try {
    if (req.isAuthenticated()) {
        const token = req.cookies.jwt;
        console.log(token)
        res.json({ authenticated: true });
      } else {
        res.json({ authenticated: false });
      }
  } catch (error) {
  console.error("An error occurred:", error);
  res.status(500).send("Internal Server Error");
  }
  ;})




  app.post('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });
  


async function getdata() { 
    const data =  await fetch('https://jsonplaceholder.typicode.com/posts') ;
    const response = await data.json();
    // console.log(response) ;
    for(let i = 0 ;i<response.length;i++){
      // console.log(response[i][) ;
      const data = new movie({
        userId : response[i]['userId'],
        id : response[i]['id'],
        title : response[i]['userId'],
        body : response[i]['userId'],
        // userId : response[i]['userId']

      })
      await data.save() ;
      console.log("data saved")
    }
}
getdata();
  

app.listen(3000, () => {
    console.log("Port 3000 is working");
});
