var express = require('express')
const { collection, query, where, getDocs } = require('firebase/firestore')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  const q = query(collection(global.db, 'events'), where('isVerified', '==', 0))
  getDocs(q).then((querySnapshot) => {
    var dataEvents = []
    querySnapshot.forEach((doc) => {
      dataEvents.push({
        id: doc.id,
        data: doc.data(),
      })
    })
    res.render('index', { events: dataEvents })
  })
})

module.exports = router
