
// REQUIRES START HERE 
const express = require("express")
const app = express()
require("dotenv").config()
// REQUIRES END HERE 

// database connection 
require("./model/index")


app.get("/",(req,res)=>{
    res.send("I am alive")
})



const PORT = process.env.PORT || 4000
app.listen(PORT,()=>{
    console.log(`Server has started at port ${PORT}`)
})