const { QueryTypes } = require("sequelize")
const { sequelize, users } = require("../../model")

exports.renderOrganizationForm = (req,res)=>{
    res.render("addOrganization")
}

const generateRandomNumber = ()=>{
    return Math.floor(1000+ Math.random() * 9000)
}
exports.createOrganization = async(req,res,next)=>{
    const userId = req.userId

    // find data of above userId 
    const user = await users.findByPk(userId)
  
    const organizationNumber = generateRandomNumber()
    const {organizationName,organizationAddress,organizationPhoneNumber,organizationEmail} = req.body 
    const organizationPanNumber = req.body.organizationPanNumber || null 
    const organizationVatNumber = req.body.organizationVatNumber|| null

    // create users_org table 
    await sequelize.query(`CREATE TABLE IF NOT EXISTS users_org(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, userId INT REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE, organizationNumber VARCHAR(255))`,{
        type : QueryTypes.CREATE                                                                                                                                                                                    
    })

    // create organization Table 
    await sequelize.query(`CREATE TABLE organization_${organizationNumber}(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), email VARCHAR(255), phoneNumber VARCHAR(255), address VARCHAR(255), panNo VARCHAR(255), vatNo VARCHAR(255) )`,{
        type : QueryTypes.CREATE
    })

    // insert above data to table 
    await sequelize.query(`INSERT INTO organization_${organizationNumber}(name,email,phoneNumber,address,panNo,vatNo) VALUES (?,?,?,?,?,?) `,{
        type : QueryTypes.INSERT,                                       
        replacements  : [organizationName,organizationEmail,organizationPhoneNumber,organizationAddress,organizationPanNumber,organizationVatNumber]
    })

    await sequelize.query(`INSERT INTO users_org (userId,organizationNumber) VALUES(?,?)`,{
        type : QueryTypes.INSERT,
        replacements : [userId,organizationNumber]
    })
    user.currentOrgNumber = organizationNumber
    await user.save()
   req.organizationNumber  = organizationNumber
   next()
}



exports.createQuestionsTable = async(req,res,next)=>{
    const organizationNumber   = req.organizationNumber

    
    // create table

    await sequelize.query(`CREATE TABLE question_${organizationNumber}(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,title VARCHAR(255),description TEXT,userId INT NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP )`,{
        type : QueryTypes.CREATE
    })
    next()
}

exports.createAnswersTable = async(req,res)=>{
    const organizationNumber = req.organizationNumber 

    await sequelize.query(`CREATE TABLE answer_${organizationNumber}(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,userId INT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE, answer TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, questionId INT REFERENCES questions(id) ON DELETE CASCADE ON UPDATE CASCADE )`,{
        type : QueryTypes.CREATE
    })
    res.redirect("/dashboard")
}

exports.createQuestionImages = async(req,res,next)=>{
    const organizationNumber = req.organizationNumber
  
    await sequelize.query(`CREATE TABLE questionImages_${organizationNumber}(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, questionId INT REFERENCES question_${organizationNumber}(id),questionImage VARCHAR(255),created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP )`,{
        type : QueryTypes.CREATE
    })
    next()
}




// dashboard

exports.renderDashboard = (req,res)=>{
    res.render("dashboard/index")
}

exports.renderForumPage = async(req,res)=>{
    const organizatonNumber = req.user[0].currentOrgNumber

    const questions = await sequelize.query(`SELECT question_${organizatonNumber}.*,users.username FROM question_${organizatonNumber} JOIN users ON question_${organizatonNumber}.userId = users.id`,{
        type : QueryTypes.SELECT
    })
    console.log(questions)
    res.render("dashboard/forum",{questions : questions})
}

exports.renderQuestionForm = (req,res)=>{
    res.render("dashboard/askQuestion")

}


exports.createQuestion = async (req,res)=>{
   const organizationNumber = req.user[0].currentOrgNumber
   

    const userId = req.userId
  
    const {title,description} = req.body 
    const files = req.files


    if(!title || !description){
        return res.send("Please provide title,description")
    }

    // insert data into tables 
   const [questionQueryResponse] =  await sequelize.query(`INSERT INTO question_${organizationNumber} (title,description,userId) VALUES(?,?,?) `,{
        type : QueryTypes.INSERT,
        replacements : [title,description,userId]
    })
 

   for(var i = 0 ; i < files.length  ;i++){
    await sequelize.query(`INSERT INTO questionImages_${organizationNumber}(questionId,questionImage) VALUE(?,?)`,{
        TYPE : QueryTypes.INSERT,
        replacements : [ questionQueryResponse,files[i].filename]
    })
   }
    res.redirect("/forum")

}

exports.renderSingleQuestion = async (req,res)=>{
    const organizationNumber= req.user[0].currentOrgNumber
    const {id} = req.params
    const question = await sequelize.query(`SELECT * FROM question_${organizationNumber} WHERE id=?`,{
        type : QueryTypes.SELECT,
        replacements : [id]
    })
    const questionImages = await sequelize.query(`SELECT * FROM questionImages_${organizationNumber} WHERE questionId=?`,{
        type : QueryTypes.SELECT,
        replacements : [id]
    })
    res.render("dashboard/singleQuestion",{question,questionImages })
}





