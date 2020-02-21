const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const config = require('../config/config')

const dbUser  = {}


const sequelizeUser = new Sequelize(
  config.db.database,      
  config.db.user,
  config.db.password,
  config.db.options
)




fs
  .readdirSync(__dirname)
  .filter((file) => 
    file !== 'index.js'
  )
  .forEach((file) => {
    const modelUser  = sequelizeUser.import(path.join(__dirname, file))
    

    dbUser[modelUser.name] = modelUser
    
  })
  
  Object.keys(dbUser).forEach(function (modelName){
    if ('associate' in dbUser[modelName]) {
      dbUser[modelName].associate(dbUser)    
    }
  })

  
  
  
 dbUser.sequelizeUser = sequelizeUser
 

 dbUser.Sequelize = Sequelize
 


module.exports.connectUser = dbUser

module.exports.test = function (login, pass) {

  const dbAdmin = {}

  const sequelizeAdmin = new Sequelize(
    config.db2.database,      
    login,
    pass,
    config.db2.options
  )

  //console.log(sequelizeAdmin)

   sequelizeAdmin
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully in TEST');
  })
  .catch(err => {
    console.log('Unable to connect to the database in TEST:', err);
  })


  fs
  .readdirSync(__dirname)
  .filter((file) => 
    file !== 'index.js'
  )
  .forEach((file) => {
    const modelAdmin = sequelizeAdmin.import(path.join(__dirname, file))
    dbAdmin[modelAdmin.name] = modelAdmin
  })

  Object.keys(dbAdmin).forEach(function (modelName){
    if ('associate' in dbAdmin[modelName]) {
      dbAdmin[modelName].associate(dbAdmin)    
    }
  })

  dbAdmin.sequelizeAdmin = sequelizeAdmin
  dbAdmin.Sequelize = Sequelize

  return dbAdmin
  //console.log('arguments: %j\n', login, pass);
}
