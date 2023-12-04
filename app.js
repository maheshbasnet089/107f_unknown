
// REQUIRES START HERE 
const express = require("express")
const app = express()
require("dotenv").config()
const passport = require("passport")
// REQUIRES END HERE 

// MIDDLEWARES 
app.set("view engine","ejs")
 app.use(passport.initialize())
 app.use(passport.session())

 passport.serializeUser(function(user,cb){
    cb(null,user)  // cb(error,success) --> cb(error)
 })
 passport.deserializeUser(function(obj,cb){
    cb(null,obj)
 })


// MIDDLEWARES END

// database connection 
require("./model/index")


app.get("/",(req,res)=>{
    res.render("home")
})


// google login here 
var userProfile ;
let GoogleStrategy = require("passport-google-oauth").OAuth2Strategy

passport.use( new GoogleStrategy({
    clientID : process.env.CLIENT_ID,
    clientSecret : process.env.CLIENT_SECRET,
    callbackURL : "http://localhost:3000/auth/google/callback"
},
function(accessToken,refreshToken,profile,done){
 
 userProfile = profile  
 return done(null,userProfile)

}
))

app.get("/auth/google",passport.authenticate("google",{scope : ['profile','email']}) )

app.get("/auth/google/callback",passport.authenticate("google",{
    failureRedirect : "http://localhost:3000"
}),
function(req,res){
    // check if google lay deko email already table ma exists xa ki nae vanerw  
    // const users =  await users.findAll({
        // where : {
            email : userProfile.email.values.
        // }
    // /

    // xa 
     // token generate garney ; jwt.sign

    // xainw 
     // users.create({})
 res.send("Logged in successfully")
}
)

// google login ends here 




const PORT = process.env.PORT || 4000
app.listen(PORT,()=>{
    console.log(`Server has started at port ${PORT}`)
})