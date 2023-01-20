var express = require('express')
const {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} = require('firebase/firestore')
const { initializeApp } = require('firebase/app')

var router = express.Router()

var dataPlaces = []
getDocs(collection(global.db, 'places')).then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    dataPlaces.push({
      id: doc.id,
      data: doc.data()['title'],
    })
  })
})

/* GET home page. */
router.get('/', function (req, res, next) {})

router.post('/accept', function (req, res, next) {
  console.log(req)
  const docu = doc(db, 'events', req.body['id'])
  updateDoc(docu, {
    isVerified: 1,
  })
    .then(function () {
      res.send({ response: 'OK' })
    })
    .catch(function (error) {
      next
    })
})

router.post('/delete', async function (req, res, next) {
  const docu = doc(db, 'events', req.body['id'])
  deleteDoc(docu)
    .then(function () {
      res.send({ response: 'OK' })
    })
    .catch(function (error) {
      next
    })
})

router.post('/valid', function (req, res, next) {
  var p = ''
  for (let place of dataPlaces)
    if (place['data'].toLowerCase().includes(req.body['id'].toLowerCase()))
      p +=
        "<div class = 'p'> <h1>" +
        place['data'] +
        '</h1> <h2> ' +
        place['id'] +
        ' </h2> </div>'
  res.send({ response: p })
})

module.exports = router
