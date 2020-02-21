const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config/config');
const {sequelize} = require('./models');
const path = require('path');

const app = express();

app.use(bodyParser.json());

app.use(cors());

app.use(function(res, req, next){
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-Width, Content-Type, Accept")
  
  next()
})


app.use(express.static(__dirname + '/img/'));

const posts = require('./routes/api/posts');

//console.log(posts)

app.use('/api/posts', posts);

//Handle all errors
/*
app.use((req, res, next) => {
  const error = new Error('Not Found');
  //console.log(error)
  error.status(404);
  next(error)
})

app.use((error, req, res, rext) => {
   res.status(error.status || 500);
   res.json({
     error: {
       message: error.message
     }
   }) 
})
*/
//Handle production
if (process.env.NODE_ENV === 'production') {
  //Static folder

  app.use(express.static(__dirname + '/public/'));
//app.use('/public',express.static( __dirname + '/public/'));
//app.use('/public', express.static(path.join(__dirname, 'public')))
console.log('production mode')
} 



app.listen(config.port)
//sequelize.connectionManager.close().then(() => console.log('shut down gracefully'));

//console.log(sequelize)
/*
sequelize.sync({force: false})
  .then(() => {
      app.listen(config.port)
      console.log(`Server started on port ${config.port}`)
  })
  */
