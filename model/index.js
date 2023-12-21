const seedAdmin = require("../adminSeeder.js");
const dbConfig = require("../config/dbConfig");
const { Sequelize, DataTypes } = require("sequelize");

// la sequelize yo config haru lag ani database connect gardey vaneko hae 
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  port : 3306, 

  pool: {   
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
// ALTERNATIVE 
// const sequelize = new Sequelize('mysql://root@localhost:3306/unknown') 




const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// importing model files 

db.users = require("./userModel.js")(sequelize, DataTypes);

sequelize
  .authenticate()
  .then(() => {
    console.log("CONNECTED!!");
    seedAdmin(db.users)
  })
  .catch((err) => {
    console.log("Error" + err);
  });


db.sequelize.sync({ force: false}).then(() => {
  console.log("yes re-sync done");
});

module.exports = db;