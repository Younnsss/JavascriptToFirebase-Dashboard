const puppeteer = require('puppeteer')
const { initializeApp } = require('firebase/app')
const { addDoc, getFirestore, collection } = require('firebase/firestore')

const app = initializeApp({
  apiKey: 'AIzaSyDCXnIqJfN4-T_2dDaRjfonKDvAZw726Fg',
  authDomain: 'pe-a22-6f100.firebaseapp.com',
  projectId: 'pe-a22-6f100',
  storageBucket: 'pe-a22-6f100.appspot.com',
  messagingSenderId: '213562738067',
  appId: '1:213562738067:web:0ab599bf10ee5df44b1466',
})

const db = getFirestore(app)

const extractData = async (page, url) => {
  const sub = url.substring(url.indexOf('@') + 1, url.indexOf(','))
  var sussub = url.replace(
    url.substring(0, url.indexOf('@') + 1) + sub + ',',
    '',
  )
  sussub = sussub.substring(0, sussub.indexOf(','))
  let items = await page.evaluate((sub, sussub) => {
    return {
      title: document.querySelector('.fontHeadlineLarge')?.textContent,
      rating: document.querySelector('.mmu3tf span span span:nth-child(1)')
        ?.textContent.replace(',', '.'),
      type: document.querySelector('.u6ijk')?.textContent,
      dimanche: document.querySelector('.fontTitleSmall+ .mxowUb')?.textContent,
      lundi: document.querySelector('.y0skZc:nth-child(2) .mxowUb')
        ?.textContent,
      mardi: document.querySelector('.y0skZc:nth-child(2) .mxowUb')
        ?.textContent,
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
      "https://www.google.com/maps/place/Domino's+Pizza+Troyes/@48.293639,4.0775883,17z/data=!4m12!1m6!3m5!1s0x47ee98f860fd02c7:0xd567e84d05ac9aa0!2sCIN%C3%89MA+CGR+Troyes!8m2!3d48.293639!4d4.079777!3m4!1s0x0:0x68b8f92ec3c0b2c5!8m2!3d48.2948964!4d4.0808062"

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
    console.log(data)
    addDoc(collection(db, 'places'), {
        title: data.title,
        rating: parseFloat(data.rating),
        type: data.type,
        coord : [parseFloat(data.lat), parseFloat(data.lng)],
        adress : data.address,
      }).then((docRef) => {
        console.log('Document written with ID: ', docRef.id)
      })

    // await browser.close();
  } catch (e) {
    console.log(e)
  }
}

getMapsPlacesData()
