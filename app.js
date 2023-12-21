
// REQUIRES START HERE 
const express = require("express")
const app = express()
require("dotenv").config()
const passport = require("passport")
const { users } = require("./model/index")
const generateToken = require("./services/generateToken")
const organizationRoute = require("./routes/organizationRoute")
const cookieParser = require("cookie-parser")
const { decodeToken } = require("./services/decodeToken")
// REQUIRES END HERE 

// MIDDLEWARES 
app.use(cookieParser())
app.set("view engine","ejs")
 app.use(passport.initialize())
 app.use(passport.session())

 app.use(express.static("public/"))
 app.use(express.static("uploads/"))

 app.use(express.json())
 app.use(express.urlencoded({extended:true}))

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

app.use(async(req,res,next)=>{
  
  const token = req.cookies.token 
  if(token){
      const decryptedResult = await decodeToken(token,process.env.SECRET)
      if(decryptedResult && decryptedResult.id){
          res.locals.currentUserRole = decryptedResult.role
      }
  }

  next()
})


app.get("/auth/google",passport.authenticate("google",{scope : ['profile','email']}) )

app.get("/auth/google/callback",passport.authenticate("google",{
    failureRedirect : "http://localhost:3000"
}),
async function(req,res){
  const userGoogleEmail=  userProfile.emails[0].value
    // check if google lay deko email already table ma exists xa ki nae vanerw  
  const user = await users.findOne({
    where : {
        email : userGoogleEmail
    }
  })
  if(user){
    // token generate garney 
 const token = generateToken(user)
 res.cookie('token',token)
 res.redirect("/organization")

  }else{
    // register the user 
   const user =  await users.create({
        email : userGoogleEmail,
        googleId  : userProfile.id,
        username : userProfile.displayName
    })
    

    const token = generateToken(user)
    res.cookie('token',token)
    res.redirect("/organization")
  }

}
)

// google login ends here 


// routes middlwares 
app.use("/",organizationRoute)

const PORT = process.env.PORT || 4000
app.listen(PORT,()=>{
    console.log(`Server has started at port ${PORT}`)
})