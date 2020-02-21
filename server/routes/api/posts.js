const express = require('express')
const Sequelize = require('sequelize')
//const mysql = require('mysql2')

const router = express.Router()
const config = require('../../config/config')
const { bibrec } = require('../../models')
const connect1 = require('../../models')
const fs = require('fs')
const multer = require('multer')
const Jimp = require('jimp')

const { sequelize1 } = require('../../models');

let sequelize2;
let hostUserConnect = [];

let testConnect = []


let connectionsArray = [];

let role = {
  user: 'denis',
  admin: 'sruser'
}


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, 'client/src/assets/')
    cb(null, 'server/img/')
    // cb(null, 'client/public/')
    //cb(null, 'public/img/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const uploads = multer({
  storage: storage
})

// Show all records
router.get('/', async (req, res) => {

  
  //console.log('testConnect',testConnect[0].bibrec)
  if (testConnect.length !== 0) {
    console.log(testConnect[0].bibrec)
  }

  connect1.connectUser.bibrec.findAll().then(function (data) {
    //console.log('sdsds')
    res.send(data);
  });
});

// Show record by ID
router.get('/:id', async (req, res) => {
  await connect1.connectUser.bibrec.findByPk(req.params.id).then(function (data) {
    console.log('get one555')
    res.status(200).send({ data });
  });
});


router.get('/print/:id', async (req, res) => {
  connect1.connectUser.bibrec.findByPk(req.params.id).then(function (data) {
    console.log('get one for print')
    res.writeHeader(200, { "Content-Type": "text/html; charset=utf-8" });
    res.write('<pre>' + data.card + '</pre>');
    res.end();
    //console.log('get one')
    // res.status(200).send({data});
  });
});


// Insert new record
router.post('/', (req, res) => {
  if (testConnect.length !== 0) {
    console.log(testConnect.length)
    console.log('==========================================')
    console.log(testConnect[0].bibrec)
    testConnect[0].bibrec.create(req.body);
    res.status(201).send();
  }
  //bibrec.create(req.body);
  //res.status(201).send();
})

// Upload Image in public/image
router.post('/upload', uploads.single("file"), (req, res) => {
  console.log('file upload  ')

  console.log(req.file)
  console.log(req.file.path)


  Jimp.read(req.file.path)
    .then(image => {
      return image
        .resize(520, 370) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(req.file.path); // save
      // Do stuff with the image.
    })
    .catch(err => {
      res.json({ error: err })
      // Handle an exception.
    });


  res.json({ file: req.file })
})

router.post('/rename', (req, res) => {
  // var filePath = 'public/img/'
  var filePath = 'client/public/'
  //var filePath = 'client/static/'

  var filePath = 'server/img/'
  // var filePath = 'client/src/assets/'

  let fileOldPath = filePath + req.body.old
  try {
    if (fs.existsSync(fileOldPath)) {
      fs.renameSync(filePath + req.body.old, filePath + req.body.new)
      console.log('REname file ' + req.body.old + ' to ' + req.body.new)
      res.sendStatus(200)
    } else {
      console.log('Rename file is NOT exists')
    }
  } catch (err) {
    console.error(err)
  }

})

// Delete record
router.delete('/:id', async (req, res) => {
  console.log('delete record')
  console.log(req)
  await testConnect[0].bibrec.destroy({ where: { id: req.params.id } })
  await res.status(200).send({});
})

// Delete file
router.post('/delete', async (req, res) => {

  var file = 'server/img/' + req.body.data

  if (fs.existsSync(file)) {
    console.log('delete file ' + file)
    await fs.unlinkSync(file)
  } else {
    console.log('deleted file not exists ' + file)
  }
  await res.sendStatus(200)
})

// Update record
router.put('/:id', async (req, res) => {
  // console.log('update')
  // console.log("login:::: "+sequelize2.config.username)

  await testConnect[0].bibrec.update(req.body,
    { where: { id: req.params.id } });
  await res.status(200).send({});
})

router.get('/last/lastrec', async (req, res) => {

  const id = await connect1.connectUser.bibrec.max('id')
  await res.status(200).send({ id })
})


//Authenticate Admin Connection
router.post('/connection/dbconnect', async (req, res, next) => {

  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  if (ip.substr(0, 7) == "::ffff:") {
    ip = ip.substr(7)
  }

  //Check Admin Login
  try {

    if (req.body.login !== role.admin) {
      res.status(400)
      res.json({
        err: {
          message: 'Admin login incorrect!'
        }
      })
    //  res.status(400)
    }

    //if (req.body.login !== role.admin) return next(new Error('Something broke again! '))

    console.log('LOGIN IS GOOD !!!! BUT')

    //New sequelize connection for check login & pass
    const reqLoginPass = new Sequelize(
      config.db2.database,
      req.body.login,
      req.body.pass,
      config.db2.options
    )

    await reqLoginPass
      .authenticate()
      .then(() => {
        console.log('Connection Login & Pass correct by sequelize');
        if (testConnect.length === 0) {
          console.log('CREATE ADMIN CONNECTION FIRST TIME')
          testConnect.push(connect1.test(req.body.login, req.body.pass))
        }

        if (hostUserConnect.length == 2) {
          hostUserConnect.pop()
        }

        if (hostUserConnect.findIndex(obj => obj.host == ip &&
          obj.user === req.body.login) === -1) {
          hostUserConnect.unshift({ host: ip, user: req.body.login })
        }

        res.status(200).send({});

      })
      .catch(err => {
       // console.log('Unable to connect to the database:', err);
        //res.status(400).send({ err });
        res.status(400)
        res.json({
          err: {
            message: err.message
          }
        })
       
      })
      .finally(() => {
        console.log('finnaly close connection for check pass & login')
        reqLoginPass.close();
        return next(new Error('Something broke again! '))
      });


  } catch (err) {
    // res.status(400).send({'unable to connect'});
    console.log('Cant connect this user !!!!', err)
    res.status(400).send({ err });
  }

})

router.post('/file/checkfile', async (req, res) => {
  //console.log(req.body)
  if (fs.existsSync('server/img/' + req.body.file)) {
    res.status(200).send({ result: true });
    console.log('The file exists.');
  } else {
    res.status(200).send({ result: false });
    console.log('The file NOT exists.');
  }

})

router.post('/connection/checkuser', async (req, res) => {
  //console.log(req.body)

  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  if (ip.substr(0, 7) == "::ffff:") {
    ip = ip.substr(7)
  }

  console.log('checkuser')
  console.log(ip)




  if (hostUserConnect.length !== 0) {

    let flag = 'false'
    console.log(hostUserConnect)
    // hostUserConnect.map((a) => (ip == a.host))   

    hostUserConnect.forEach(function (a) {
      if (ip === a.host && req.body.user === a.user) {
        console.log(ip + '   ==== ' + a.host)
        flag = 'true'
      }
    })

    await res.status(200).send({ connect: flag })
  } else {
    await res.status(200).send({ connect: 'false' })
  }


})


module.exports = router;
