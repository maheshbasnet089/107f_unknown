

const seedAdmin  = async(users)=>{
    const isAdminExists = await users.findAll({
        where : {
          email : "basnetmanish088@gmail.com"
        }
    
       })
       if(isAdminExists.length == 0 ){
        await users.create({
          email : "basnetmanish088@gmail.com",
          username : "admin",
          googleId : "103927957839910049417",
          role : "admin"
        })
        console.log("Admin seeded successfully")
       } else{
    
         console.log("admin already seeded")
       }
    
}

module.exports = seedAdmin