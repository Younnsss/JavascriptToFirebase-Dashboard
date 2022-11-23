    // lat : url.substring(url.indexOf("@")+1, url.indexOf(",")),
    // lng : url.substring(url.indexOf(",")+1, url.indexOf(",")),

    const url = "https://www.google.com/maps/place/Nigloland/@48.260641,4.6078443,17z/data=!3m1!4b1!4m5!3m4!1s0x47ec40fecb88d2c3:0xf746b0e3c0de7930!8m2!3d48.260641!4d4.610033";
const sub = url.substring(url.indexOf("@")+1, url.indexOf(","));
console.log(sub);
var sussub = url.replace(url.substring(0, url.indexOf("@")+1)+sub+',',"");
console.log(sussub.substring(0, sussub.indexOf(",")));
    // sussub = sub.replace(url.substring(url.indexOf("@")+1, url.indexOf(",")),'');
    // console.log(sussub.substring(1, sussub.indexOf(",")));