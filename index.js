const puppeteer = require("puppeteer");

    const extractData = async (page, url) => {
    const sub = url.substring(url.indexOf("@")+1, url.indexOf(","));
    var sussub = url.replace(url.substring(0, url.indexOf("@")+1)+sub+',',"");
    sussub = sussub.substring(0, sussub.indexOf(","));
    console.log(sussub);
    let items = await page.evaluate((sub, sussub) => {
    return {
        title: document.querySelector(".fontHeadlineLarge")?.textContent,
        rating: document.querySelector(".mmu3tf span span span:nth-child(1)")?.textContent,
        type: document.querySelector(".u6ijk")?.textContent,
        dimanche: document.querySelector(".fontTitleSmall+ .mxowUb")?.textContent,
        lundi: document.querySelector(".y0skZc:nth-child(2) .mxowUb")?.textContent,
        mardi: document.querySelector(".y0skZc:nth-child(2) .mxowUb")?.textContent,
        lat:"",
        lng:"",
        address: document.querySelector(".AG25L:nth-child(3) .fontBodyMedium")?.textContent.trim().substring(0, document.querySelector(".AG25L:nth-child(3) .fontBodyMedium")?.textContent.trim().indexOf(",")),
        photos: Array.from(document.querySelectorAll(".dryRY .ofKBgf"))[0].querySelector("img").getAttribute("src"),
    }
    });
    items.lat = sub;
    items.lng = sussub;
    return items;
    }

    const getMapsPlacesData = async () => {
    try {
    const url = "https://www.google.com/maps/place/Domino's+Pizza+Troyes/@48.293639,4.0775883,17z/data=!4m12!1m6!3m5!1s0x47ee98f860fd02c7:0xd567e84d05ac9aa0!2sCIN%C3%89MA+CGR+Troyes!8m2!3d48.293639!4d4.079777!3m4!1s0x0:0x68b8f92ec3c0b2c5!8m2!3d48.2948964!4d4.0808062";

    browser = await puppeteer.launch({
        headless: false,
        args: ["--disabled-setuid-sandbox", "--no-sandbox"],
    });
    const [page] = await browser.pages();

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(8000);

    page.click(".M5ziBd");

    await page.waitForTimeout(3000);

    const data = await extractData(page, url);
    console.log(data)

    // await browser.close();
    }
    catch (e) {
    console.log(e);
    }
    }

    getMapsPlacesData();  

    // lat : url.substring(url.indexOf("@")+1, url.indexOf(",")),
    // lng : url.substring(url.indexOf(",")+1, url.indexOf(",")),