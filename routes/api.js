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
const { ref, deleteObject } = require('firebase/storage')
const { authenticateToken } = require('../controller/authenticate')

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


router.post('/accept',authenticateToken, function (req, res, next) {
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

router.post('/deleteModif',authenticateToken, function (req, res, next) {
  const docu = doc(db, 'modifs', req.body['id'])
  deleteDoc(docu)
    .then(function () {
      res.send({ response: 'OK' })
    })
    .catch(function (error) {
      next
    })
})

router.post('/acceptModif',authenticateToken, async function (req, res, next) {
  const q = query(
    collection(global.db, 'places'),
    where('title', '==', req.body['place']),
  )
  getDocs(q).then((querySnapshot) => {
    querySnapshot.forEach((document) => {
      const docu2 = doc(db, 'places', document.id)
      if (req.body['modif'] == 'le titre') {
        updateDoc(docu2, {
          title: req.body['newData'],
        })
      } else if (req.body['modif'] == "l'adresse") {
        updateDoc(docu2, {
          adress: req.body['newData'],
        })
      } else if (req.body['modif'] == 'les horaires') {
        updateDoc(docu2, {
          schedule: req.body['newData']
            .substring(2, req.body['newData'].length - 2)
            .split('","'),
        })
      }
      // let events = Array.from(document.data()["events"].map(str => str.toString()));
    })
  })
})

router.post('/delete',authenticateToken, async function (req, res, next) {
  const docu = doc(global.db, 'events', req.body['id'])
  const q = query(
    collection(global.db, 'places'),
    where('title', '==', req.body['place']),
  )
  if (req.body['image'] != 'events/sample.jpg') {
    const imageref = ref(global.sto, req.body['image'])
    deleteObject(imageref)
      .then(() => {
        console.log('Image deleted successfully')
      })
      .catch((error) => {
        console.log(`Error deleting image: ${error}`)
      })
  }
  getDocs(q).then((querySnapshot) => {
    querySnapshot.forEach((document) => {
      let events = Array.from(
        document.data()['events'].map((str) => str.toString()),
      )
      const docu2 = doc(db, 'places', document.id)
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

router.post('/valid', authenticateToken, function (req, res, next) {
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
