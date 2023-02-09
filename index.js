const puppeteer = require('puppeteer')
const { getStorage, ref, uploadBytes, uploadString } = require("firebase/storage");
const { initializeApp } = require('firebase/app')
const { addDoc, getFirestore, collection } = require('firebase/firestore');
const { fetch } = require('cross-fetch');
const fs = require('fs');
const path = require('path');

const app = initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
})

const db = getFirestore(app)
const storage = getStorage();

const extractData = async (page, url) => {
  const sub = url.substring(url.indexOf('@') + 1, url.indexOf(','))
  var sussub = url.replace(
    url.substring(0, url.indexOf('@') + 1) + sub + ',',
    '',
  )
  sussub = sussub.substring(0, sussub.indexOf(','))
  let items = await page.evaluate((sub, sussub) => {
    function convertSchedule(schedule){
      if (schedule==null) return "Ouvert 24h/24";
      schedule = schedule.trim();
      if(schedule.length>15){
        schedule = schedule.substring(0, 11) + '/' + schedule.substring(11);
      }
      return schedule;
    }
    return {
      title: document.querySelector('.fontHeadlineLarge')?.textContent.trim(),
      rating: document.querySelector('.mmu3tf span span span:nth-child(1)')
        ?.textContent.replace(',', '.'),
      first: convertSchedule(document.querySelector('.fontTitleSmall .G8aQO')?.textContent),
      second: convertSchedule( document.querySelector('.y0skZc:nth-child(2) .G8aQO')
        ?.textContent),
      third: convertSchedule(document.querySelector('.y0skZc:nth-child(3) .mxowUb')
        ?.textContent),
      fourth: convertSchedule(document.querySelector('.y0skZc:nth-child(4) .mxowUb')
        ?.textContent),
      fifth: convertSchedule(document.querySelector('.y0skZc:nth-child(5) .mxowUb')
        ?.textContent),
      sixth: convertSchedule(document.querySelector('.y0skZc:nth-child(6) .mxowUb')
        ?.textContent),
      seventh: convertSchedule(document.querySelector('.y0skZc:nth-child(7) .mxowUb')
        ?.textContent),
      lat: '',
      lng: '',
      address: document
        .querySelector('.AG25L:nth-child(3) .fontBodyMedium')
        ?.textContent.trim()
        .substring(
          0,
          document
            .querySelector('.AG25L:nth-child(3) .fontBodyMedium')
            ?.textContent.trim()
            .indexOf(','),
        ),
      photos: Array.from(document.querySelectorAll('.dryRY .ofKBgf'))[0]
        .querySelector('img')
        .getAttribute('src'),
    }
  })
  items.lat = sub
  items.lng = sussub
  return items
}

const getMapsPlacesData = async () => {
  try {
    const url =
      "https://www.google.com/maps/place/Parc+des+Moulins/@48.286858,4.0870598,21z/data=!4m8!1m2!2m1!1zbXVzw6ll!3m4!1s0x47ee98e27a7f9393:0x9a7ebe0abf97342!8m2!3d48.2868788!4d4.0872307?hl=fr"
    browser = await puppeteer.launch({
      headless: false,
      args: ['--disabled-setuid-sandbox', '--no-sandbox'],
    })
    const [page] = await browser.pages()

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(4000)

    page.click('form+ form .VfPpkd-RLmnJb')

    await page.waitForTimeout(9000)

    const data = await extractData(page, url)

    function imageName(name) {
      splitname = name.split(' ')
      if(splitname[0].length < 4){
        return 'images/' +splitname[0] + splitname[1] + '.png'
      }
      return 'images/' +name.split(' ')[0] + '.png'
    }

    console.log(data)
    addDoc(collection(db, 'places'), {
        title: data.title,
        rating: parseFloat(data.rating),
        type: 'tourisme', // HARDCODE
        coord : [parseFloat(data.lat), parseFloat(data.lng)],
        adress : data.address,
        img : imageName(data.title),
        events : [""],
        schedule : [
          data.seventh, // HARDCODE LUNDI
          data.first, // HARDCODE MARDI 
          data.second, // HARDCODE MERCREDI
          data.third, // HARDCODE JEUDI
          data.fourth, // HARDCODE VENDREDI
          data.fifth, // HARDCODE SAMEDI
          data.sixth, // HARDCODE DIMANCHE
        ]
      }).then((docRef) => {
        console.log('Document written with ID: ', docRef.id)
      })
    
      const storageRef = ref(storage, imageName(data.title));

    
      const image = await page.goto(data.photos)
      const buffer = await image.buffer()
      fs.writeFileSync('image.png', buffer)
      // const imageFile = fs.readFileSync('image.png')
      fs.readFile('image.png', (err, data)=>{
        // error handle
        if(err) {
            throw err;
        }
        
        // get image file extension name
        const extensionName = path.extname('image.png');
        
        // convert image file to base64-encoded string
        const base64Image = Buffer.from(data, 'binary').toString('base64');
      
        
        // combine all strings
        const base64ImageStr = `data:image/${extensionName.split('.').pop()};base64,${base64Image}`;
        uploadString(storageRef, base64ImageStr, 'data_url').then((snapshot) => {
          console.log('Uploaded a base64 string!');
        });
    })



    await browser.close();
  } catch (e) {
    console.log(e)
  }
}

getMapsPlacesData()
