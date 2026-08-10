const TITHIS = [

"Pratipada",
"Dwitiya",
"Tritiya",
"Chaturthi",
"Panchami",
"Shashthi",
"Saptami",
"Ashtami",
"Navami",
"Dashami",
"Ekadashi",
"Dwadashi",
"Trayodashi",
"Chaturdashi",
"Pournami",
"Pratipada",
"Dwitiya",
"Tritiya",
"Chaturthi",
"Panchami",
"Shashthi",
"Saptami",
"Ashtami",
"Navami",
"Dashami",
"Ekadashi",
"Dwadashi",
"Trayodashi",
"Chaturdashi",
"Amavasya"

];

const NAKSHATRAS = [

"Ashwini",
"Bharani",
"Krittika",
"Rohini",
"Mrigashira",
"Ardra",
"Punarvasu",
"Pushya",
"Ashlesha",
"Magha",
"Purva Phalguni",
"Uttara Phalguni",
"Hasta",
"Chitra",
"Swati",
"Vishakha",
"Anuradha",
"Jyeshta",
"Moola",
"Purva Ashadha",
"Uttara Ashadha",
"Shravana",
"Dhanishta",
"Shatabhisha",
"Purva Bhadrapada",
"Uttara Bhadrapada",
"Revati"

];

const YOGAS = [

"Vishkambha",
"Priti",
"Ayushman",
"Saubhagya",
"Shobhana",
"Atiganda",
"Sukarma",
"Dhriti",
"Shoola",
"Ganda",
"Vriddhi",
"Dhruva",
"Vyaghata",
"Harshana",
"Vajra",
"Siddhi",
"Vyatipata",
"Variyana",
"Parigha",
"Shiva",
"Siddha",
"Sadhya",
"Shubha",
"Shukla",
"Brahma",
"Indra",
"Vaidhriti"

];

const KARANAS = [

"Bava",
"Balava",
"Kaulava",
"Taitila",
"Garaja",
"Vanija",
"Vishti",
"Bava",
"Balava",
"Kaulava",
"Taitila",
"Garaja",
"Vanija",
"Vishti",
"Bava",
"Balava",
"Kaulava",
"Taitila",
"Garaja",
"Vanija",
"Vishti",
"Bava",
"Balava",
"Kaulava",
"Taitila",
"Garaja",
"Vanija",
"Vishti",
"Shakuni",
"Chatushpada",
"Naga",
"Kimstughna"

];

const WEEKDAYS=[

"Sunday",
"Monday",
"Tuesday",
"Wednesday",
"Thursday",
"Friday",
"Saturday"

];

function normalize(x){

x%=360;

if(x<0)
x+=360;

return x;

}

function calculate(sunLongitude,moonLongitude,date){

sunLongitude=normalize(sunLongitude);

moonLongitude=normalize(moonLongitude);

const diff=normalize(moonLongitude-sunLongitude);

const tithiNo=Math.floor(diff/12);

const paksha=tithiNo<15?"Shukla":"Krishna";

const tithi=TITHIS[tithiNo];

const nakNo=Math.floor(moonLongitude/(13+20/60));

const nakshatra=NAKSHATRAS[nakNo];

const pada=Math.floor(

(moonLongitude%(13+20/60))

/

(3+20/60)

)+1;

const yogaNo=Math.floor(

normalize(sunLongitude+moonLongitude)

/(13+20/60)

);

const yoga=YOGAS[yogaNo];

const karanaNo=Math.floor(diff/6);

const karana=KARANAS[Math.min(karanaNo,31)];

const weekday=WEEKDAYS[new Date(date).getDay()];

return{

weekday,

paksha,

tithi,

tithiNumber:tithiNo+1,

nakshatra,

pada,

yoga,

karana

};

}

module.exports={

calculate

};