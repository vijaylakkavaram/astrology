const swe = require("sweph");

// -----------------------------
// Setup
// -----------------------------

swe.set_ephe_path("./ephe");

// Lahiri Ayanamsa
swe.set_sid_mode(1, 0, 0);


// -----------------------------
// Current time UTC
// -----------------------------

const now = new Date();

const year = now.getUTCFullYear();
const month = now.getUTCMonth() + 1;
const day = now.getUTCDate();

const hourUTC =
    now.getUTCHours() +
    now.getUTCMinutes() / 60 +
    now.getUTCSeconds() / 3600;

console.log(
    "UTC:",
    day,month,year);

// -----------------------------
// Bengaluru
// -----------------------------

const latitude = 12.9716;
const longitude = 77.5946;


// -----------------------------
// Julian Day
// -----------------------------

const jd = swe.julday(
    year,
    month,
    day,
    hourUTC,
    1
);


console.log("JD:", jd);


// -----------------------------
// Rashi
// -----------------------------

const rashis = [
    "Mesha",
    "Vrishabha",
    "Mithuna",
    "Karka",
    "Simha",
    "Kanya",
    "Tula",
    "Vrishchika",
    "Dhanu",
    "Makara",
    "Kumbha",
    "Meena"
];


function normalize(x) {
    x = x % 360;
    if (x < 0) x += 360;
    return x;
}


function rashiPosition(deg) {

    deg = normalize(deg);

    return {
        longitude: deg.toFixed(4),
        rashi: rashis[Math.floor(deg / 30)],
        degree: (deg % 30).toFixed(2)
    };
}


// -----------------------------
// Planets
// -----------------------------

const planets = {
    Sun: 0,
    Moon: 1,
    Mercury: 2,
    Venus: 3,
    Mars: 4,
    Jupiter: 5,
    Saturn: 6,
    Rahu: 10
};


let kundali = {};


// IMPORTANT:
// Use SIDEREAL flag here
// Do NOT subtract ayanamsa manually

const flags =
    65536 | 65536; 


for (const name in planets) {

    const result = swe.calc_ut(
        jd,
        planets[name],
        flags
    );


    const longitude =
        Number(result.data[0]);


    kundali[name] =
        rashiPosition(longitude);


    console.log(
        name,
        kundali[name]
    );
}


// -----------------------------
// Ketu
// -----------------------------

kundali.Ketu =
    rashiPosition(
        Number(kundali.Rahu.longitude) + 180
    );


// -----------------------------
// Lagna
// -----------------------------

const houses = swe.houses(
    jd,
    latitude,
    longitude,
    "P"
);


const lagna =
    Number(houses.data.points[0]);


const ayanamsa =
    swe.get_ayanamsa_ut(jd);


kundali.Lagna =
    rashiPosition(
        lagna - ayanamsa
    );


// -----------------------------
// Output
// -----------------------------

console.log(
    JSON.stringify(
        kundali,
        null,
        2
    )
);