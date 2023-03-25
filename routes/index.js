var express = require('express')
const { collection, query, where, getDocs } = require('firebase/firestore')
const { authenticateToken } = require('../controller/authenticate')
var router = express.Router()
const { signin} = require('../controller/userController')

/* GET home page. */
router.get('/dashboard', authenticateToken, function (req, res, next) {

  getDocs(collection(global.db, 'events')).then((querySnapshot) => {
    var dataEvents = []
    querySnapshot.forEach((doc) => {
      dataEvents.push({
        id: doc.id,
        data: doc.data(),
      })
    })
    getDocs(collection(global.db, 'modifs')).then((querySnapshot2) => {
      var modifsEvents = []
      querySnapshot2.forEach((doc2) => {
        modifsEvents.push({
          id: doc2.id,
          data: doc2.data(),
        })
      })
      res.render('index', { events: dataEvents, modifs: modifsEvents })
    })
  })
})

router.get('/', function (req, res, next) {
  res.render('login')
})

router.get('/privacy', function (req, res, next) {
  res.render('privacy')
})

router.post('/signin', signin)

module.exports = router
