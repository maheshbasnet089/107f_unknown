module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      googleId: {
        type: DataTypes.STRING,
        allowNull : false
      },
      username: {
        type: DataTypes.STRING,
        allowNull:false
      },
      currentOrgNumber : {
        type : DataTypes.INTEGER,
        allowNull : true
      },
      role : {
        type : DataTypes.ENUM('user','admin'),
        
        defaultValue : "user" 
      }

    
    });
    return User;
  };