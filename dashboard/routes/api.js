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
  FieldValue,
} = require('firebase/firestore')

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
  const docu = doc(global.db, 'events', req.body['id'])
  const q = query(collection(global.db, "places"), where("title", "==", req.body['place']));
  getDocs(q).then((querySnapshot) => {
    querySnapshot.forEach((document) => {
      let events = Array.from(document.data()["events"].map(str => str.toString()));
      const docu2 = doc(db, 'places', document.id);
      updateDoc(docu2, {
        events: events.filter((item) => item !== req.body['id']),
      })
    })
  })  
  deleteDoc(docu)
    .then(function () {
      res.send({ response: 'OK' })
    })
    .catch(function (error) {
      next
    })
  console.log(req.body['id'])
  console.log(req.body['place'])
})

router.post('/valid', function (req, res, next) {
  var p = ''
  for (let place of dataPlaces)
    if (place['data'].toLowerCase().includes(req.body['id'].toLowerCase()))
      p +=
        "<div class = 'p'> <h2>" +
        place['data'] +
        '</h2> <h3> ' +
        place['id'] +
        ' </h3> </div>'
  res.send({ response: p })
})

module.exports = router
