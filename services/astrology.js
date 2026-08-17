const swe = require("sweph");
const panchang = require("./panchang");
const dasha = require("./dasha");

const path = require("path");
const dosha = require("./dosha");

swe.set_ephe_path(
    path.join(__dirname, "ephe")
);

const {
    detectYogas
} = require("./yoga");

const {
    calculateVargas
} = require("./varga");


const {
    calculateShadbala
} = require("./shadbala");

// Lahiri Ayanamsa
swe.set_sid_mode(1, 0, 0);


// ==========================================
// RASHIS
// ==========================================

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


// ==========================================
// NORMALIZE
// ==========================================

function normalize(x) {

    x = x % 360;

    if (x < 0) {
        x += 360;
    }

    return x;
}


// ==========================================
// RASHI POSITION
// ==========================================

function rashiPosition(deg) {

    deg = normalize(deg);

    return {

        longitude: deg,

        rashi:
            rashis[
                Math.floor(deg / 30)
            ],

        degree:
            Number(
                (deg % 30).toFixed(2)
            )
    };
}


// ==========================================
// NAKSHATRAS
// ==========================================

const nakshatras = [

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
    "Jyeshtha",
    "Mula",
    "Purva Ashadha",
    "Uttara Ashadha",
    "Shravana",
    "Dhanishtha",
    "Shatabhisha",
    "Purva Bhadrapada",
    "Uttara Bhadrapada",
    "Revati"

];


// ==========================================
// NAKSHATRA LORDS
// ==========================================

const nakshatraLords = [

    "Ketu",
    "Venus",
    "Sun",
    "Moon",
    "Mars",
    "Rahu",
    "Jupiter",
    "Saturn",
    "Mercury",

    "Ketu",
    "Venus",
    "Sun",
    "Moon",
    "Mars",
    "Rahu",
    "Jupiter",
    "Saturn",
    "Mercury",

    "Ketu",
    "Venus",
    "Sun",
    "Moon",
    "Mars",
    "Rahu",
    "Jupiter",
    "Saturn",
    "Mercury"

];


// ==========================================
// VIMSHOTTARI DASHA
// ==========================================

const dashaYears = {

    Ketu: 7,
    Venus: 20,
    Sun: 6,
    Moon: 10,
    Mars: 7,
    Rahu: 18,
    Jupiter: 16,
    Saturn: 19,
    Mercury: 17

};


const dashaOrder = [

    "Ketu",
    "Venus",
    "Sun",
    "Moon",
    "Mars",
    "Rahu",
    "Jupiter",
    "Saturn",
    "Mercury"

];


// ==========================================
// NAKSHATRA CALCULATION
// ==========================================

function getNakshatra(longitude) {

    longitude = normalize(longitude);


    // --------------------------------------
    // Nakshatra size = 13°20'
    // --------------------------------------

    const nakshatraSize =
        360 / 27;


    // --------------------------------------
    // Pada size = 3°20'
    // --------------------------------------

    const padaSize =
        nakshatraSize / 4;


    // --------------------------------------
    // Nakshatra index
    // --------------------------------------

    const nakshatraIndex =
        Math.floor(
            longitude / nakshatraSize
        );


    // --------------------------------------
    // Nakshatra start
    // --------------------------------------

    const nakshatraStart =
        nakshatraIndex *
        nakshatraSize;


    // --------------------------------------
    // Position inside Nakshatra
    // --------------------------------------

    const positionInNakshatra =
        longitude -
        nakshatraStart;


    // --------------------------------------
    // Pada
    // --------------------------------------

    const pada =
        Math.floor(
            positionInNakshatra /
            padaSize
        ) + 1;


    // ======================================
    // NAKSHATRA LORD
    // ======================================

    const nakshatraLord =
        nakshatraLords[
            nakshatraIndex
        ];


    // ======================================
    // SUB LORD
    // ======================================

    const totalDashaYears = 120;

    const nakshatraLordIndex =
        dashaOrder.indexOf(
            nakshatraLord
        );


    let accumulated = 0;

    let subLord = null;

    let subLordStart = 0;

    let subLordEnd = 0;


    for (let i = 0; i < 9; i++) {

        const lordIndex =
            (
                nakshatraLordIndex +
                i
            ) % 9;


        const lord =
            dashaOrder[lordIndex];


        const subLength =
            nakshatraSize *
            (
                dashaYears[lord] /
                totalDashaYears
            );


        const start =
            accumulated;


        const end =
            accumulated +
            subLength;


        if (
            positionInNakshatra >= start &&
            positionInNakshatra < end
        ) {

            subLord = lord;

            subLordStart = start;

            subLordEnd = end;

            break;
        }


        accumulated = end;
    }


    // ======================================
    // SOOKSHMA DAIPATHI
    // ======================================

    let sookshmaDaipathi = null;


    if (subLord) {

        const subLordIndex =
            dashaOrder.indexOf(
                subLord
            );


        const subLordPosition =
            positionInNakshatra -
            subLordStart;


        const subLordDuration =
            subLordEnd -
            subLordStart;


        let subAccumulated = 0;


        for (let i = 0; i < 9; i++) {

            const lordIndex =
                (
                    subLordIndex +
                    i
                ) % 9;


            const lord =
                dashaOrder[lordIndex];


            const subSubLength =
                subLordDuration *
                (
                    dashaYears[lord] /
                    totalDashaYears
                );


            const start =
                subAccumulated;


            const end =
                subAccumulated +
                subSubLength;


            if (
                subLordPosition >= start &&
                subLordPosition < end
            ) {

                sookshmaDaipathi =
                    lord;

                break;
            }


            subAccumulated = end;
        }
    }


    // ======================================
    // RETURN NAKSHATRA DETAILS
    // ======================================

    return {

        nakshatra:
            nakshatras[
                nakshatraIndex
            ],

        // Nakshatra Lord
        nakshatraLord,

        // Sub Lord
        subLord,

        // Sookshma Daipathi
        sookshmaDaipathi,

        pada,

        nakshatraIndex:
            nakshatraIndex + 1,

        degreeInNakshatra:
            Number(
                positionInNakshatra
                    .toFixed(4)
            )

    };
}


// ==========================================
// PLANETS
// ==========================================

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


// ==========================================
// COMBUSTION
// ==========================================

function getAngularDistance(
    planetLongitude,
    sunLongitude
) {

    const difference =
        Math.abs(
            normalize(
                planetLongitude -
                sunLongitude
            )
        );


    return Math.min(
        difference,
        360 - difference
    );
}


const combustionLimits = {

    Moon: 12,

    Mars: 17,

    Mercury: 14,

    Jupiter: 11,

    Venus: 10,

    Saturn: 15

};


function isCombust(
    planet,
    planetLongitude,
    sunLongitude
) {

    if (planet === "Sun") {
        return false;
    }


    if (
        planet === "Rahu" ||
        planet === "Ketu"
    ) {

        return false;
    }


    const limit =
        combustionLimits[planet];


    if (limit === undefined) {
        return false;
    }


    const distance =
        getAngularDistance(
            planetLongitude,
            sunLongitude
        );


    return distance <= limit;
}


// ==========================================
// SUNRISE / SUNSET
// ==========================================

function getSunriseSunset(
    jd,
    latitude,
    longitude
) {

    const geopos = [

        Number(longitude),

        Number(latitude),

        0

    ];


    const riseFlags = 1;

    const setFlags = 2;


    const rise =
        swe.rise_trans(
            jd,
            0,
            "",
            0,
            riseFlags,
            geopos,
            1013.25,
            15
        );


    const set =
        swe.rise_trans(
            jd,
            0,
            "",
            0,
            setFlags,
            geopos,
            1013.25,
            15
        );


    return {

        sunrise:
            Number(rise.data[0]),

        sunset:
            Number(set.data[0])

    };
}


// ==========================================
// MANDHI
// ==========================================

function calculateMandhi(
    jd,
    latitude,
    longitude
) {

    const {
        sunrise,
        sunset
    } =
        getSunriseSunset(
            jd,
            latitude,
            longitude
        );


    const weekday =
        Math.floor(
            (jd + 1.5) % 7
        );


    const daySegment = {

        0: 7,
        1: 6,
        2: 5,
        3: 4,
        4: 3,
        5: 2,
        6: 1

    };


    const segmentNumber =
        daySegment[weekday];


    const dayDuration =
        sunset - sunrise;


    const segmentDuration =
        dayDuration / 8;


    const mandhiJD =
        sunrise +
        (
            (segmentNumber - 1) *
            segmentDuration
        ) +
        (
            segmentDuration / 2
        );


    const houses =
        swe.houses(
            mandhiJD,
            Number(latitude),
            Number(longitude),
            "P"
        );


    const tropicalAscendant =
        Number(
            houses.data.points[0]
        );


    const ayanamsa =
        swe.get_ayanamsa_ut(
            mandhiJD
        );


    const mandhiLongitude =
        normalize(
            tropicalAscendant -
            ayanamsa
        );


    const position =
        rashiPosition(
            mandhiLongitude
        );


    const nakshatra =
        getNakshatra(
            mandhiLongitude
        );


    return {

        name: "Mandhi",

        longitude:
            mandhiLongitude,

        rashi:
            position.rashi,

        degree:
            position.degree,

        nakshatra:
            nakshatra.nakshatra,

        // NEW
        nakshatraLord:
            nakshatra.nakshatraLord,

        // NEW
        subLord:
            nakshatra.subLord,

        // NEW
        sookshmaDaipathi:
            nakshatra.sookshmaDaipathi,

        pada:
            nakshatra.pada,

        nakshatraIndex:
            nakshatra.nakshatraIndex,

        sunrise,

        sunset,

        segment:
            segmentNumber,

        mandhiJD

    };
}
// ==========================================
// NAVAMSA / D9
// ==========================================

function getNavamsaSign(longitude) {

    longitude = normalize(longitude);

    const signIndex =
        Math.floor(longitude / 30);

    const degreeInSign =
        longitude % 30;

    // Each Navamsa = 3°20'
    const navamsaSize =
        30 / 9;

    const navamsaIndex =
        Math.floor(
            degreeInSign / navamsaSize
        );


    // Movable signs
    // Mesha, Karka, Tula, Makara
    const movable = [
        0, 3, 6, 9
    ];


    // Fixed signs
    // Vrishabha, Simha, Vrishchika, Kumbha
    const fixed = [
        1, 4, 7, 10
    ];


    // Dual signs
    // Mithuna, Kanya, Dhanu, Meena
    const dual = [
        2, 5, 8, 11
    ];


    let startSign;


    if (movable.includes(signIndex)) {

        startSign = signIndex;

    }
    else if (fixed.includes(signIndex)) {

        startSign =
            (signIndex + 8) % 12;

    }
    else if (dual.includes(signIndex)) {

        startSign =
            (signIndex + 4) % 12;

    }


    const navamsaSignIndex =
        (
            startSign +
            navamsaIndex
        ) % 12;


    return {

        sign:
            rashis[
                navamsaSignIndex
            ],

        signIndex:
            navamsaSignIndex,

        navamsaNumber:
            navamsaIndex + 1,

        degreeInNavamsa:
            Number(
                (
                    degreeInSign -
                    (
                        navamsaIndex *
                        navamsaSize
                    )
                ).toFixed(4)
            )

    };

}


// ==========================================
// GENERATE KUNDALI
// ==========================================

async function generate(data) {

    const {
        name,
        date,
        time,
        latitude,
        longitude,
        timezone
    } = data;
 
    // ======================================
    // DATE / TIME
    // ======================================

    const [year, month, day] =
        date
            .split("-")
            .map(Number);


    const [hour, minute] =
        time
            .split(":")
            .map(Number);


    const hourUTC =
        hour +
        minute / 60 -
        Number(timezone);


    // ======================================
    // JULIAN DAY
    // ======================================

    const jd =
        swe.julday(
            year,
            month,
            day,
            hourUTC,
            1
        );


    let kundali = {};


    // ======================================
    // FLAGS
    // ======================================

    const flags =
        65536 | 256;


    // ======================================
    // PLANET POSITIONS
    // ======================================

    for (const name in planets) {

        const result =
            swe.calc_ut(
                jd,
                planets[name],
                flags
            );


        const planetLongitude =
            Number(
                result.data[0]
            );


        const speed =
            Number(
                result.data[3]
            );


        // ==================================
        // NAKSHATRA
        // ==================================

        const nakshatra =
            getNakshatra(
                planetLongitude
            );


        // ==================================
        // NAVAMSA
        // ==================================

        const navamsa =
            getNavamsaSign(
                planetLongitude
            );


        kundali[name] = {

            ...rashiPosition(
                planetLongitude
            ),


            longitude:
                planetLongitude,


            speed,


            retrograde:
                speed < 0,


            // ==============================
            // NAKSHATRA
            // ==============================

            nakshatra:
                nakshatra.nakshatra,

            nakshatraLord:
                nakshatra.nakshatraLord,

            subLord:
                nakshatra.subLord,

            sookshmaDaipathi:
                nakshatra.sookshmaDaipathi,

            pada:
                nakshatra.pada,

            nakshatraIndex:
                nakshatra.nakshatraIndex,


            // ==============================
            // NAVAMSA / D9
            // ==============================

            navamsaRashi:
                navamsa.sign,

            navamsaSignIndex:
                navamsa.signIndex,

            navamsaNumber:
                navamsa.navamsaNumber,

            degreeInNavamsa:
                navamsa.degreeInNavamsa,

                 
        };

    }


    // ======================================
    // SUN LONGITUDE
    // ======================================

    const sunLongitude =
        kundali.Sun.longitude;


    // ======================================
    // COMBUSTION
    // ======================================

    for (const name in kundali) {

        if (name === "Sun") {

            kundali[name].combust =
                false;

            kundali[name].sunDistance =
                0;

            continue;
        }


        const planetLongitude =
            kundali[name].longitude;


        const sunDistance =
            getAngularDistance(
                planetLongitude,
                sunLongitude
            );


        kundali[name].sunDistance =
            Number(
                sunDistance.toFixed(4)
            );


        kundali[name].combust =
            isCombust(
                name,
                planetLongitude,
                sunLongitude
            );

    }


    // ======================================
    // KETU
    // ======================================

    const ketuLongitude =
        normalize(
            Number(
                kundali.Rahu.longitude
            ) + 180
        );


    const ketuNakshatra =
        getNakshatra(
            ketuLongitude
        );


    // IMPORTANT:
    // Calculate Ketu Navamsa separately
    const ketuNavamsa =
        getNavamsaSign(
            ketuLongitude
        );


    kundali.Ketu = {

        ...rashiPosition(
            ketuLongitude
        ),


        longitude:
            ketuLongitude,


        speed:
            kundali.Rahu.speed,


        retrograde:
            true,


        combust:
            false,


        sunDistance:
            getAngularDistance(
                ketuLongitude,
                sunLongitude
            ),


        // ==============================
        // KETU NAKSHATRA
        // ==============================

        nakshatra:
            ketuNakshatra.nakshatra,

        nakshatraLord:
            ketuNakshatra.nakshatraLord,

        subLord:
            ketuNakshatra.subLord,

        sookshmaDaipathi:
            ketuNakshatra.sookshmaDaipathi,

        pada:
            ketuNakshatra.pada,

        nakshatraIndex:
            ketuNakshatra.nakshatraIndex,


        // ==============================
        // KETU NAVAMSA
        // ==============================

        navamsaRashi:
            ketuNavamsa.sign,

        navamsaSignIndex:
            ketuNavamsa.signIndex,

        navamsaNumber:
            ketuNavamsa.navamsaNumber,

        degreeInNavamsa:
            ketuNavamsa.degreeInNavamsa

    };


    // ======================================
    // LAGNA
    // ======================================

    const houses =
        swe.houses(
            jd,
            Number(latitude),
            Number(longitude),
            "P"
        );


    const mandhi =
        calculateMandhi(
            jd,
            Number(latitude),
            Number(longitude)
        );


    const lagna =
        Number(
            houses.data.points[0]
        );


    const ayanamsa =
        swe.get_ayanamsa_ut(jd);


    const siderealLagna =
        normalize(
            lagna -
            ayanamsa
        );


    // ======================================
    // NAVAMSA LAGNA
    // ======================================

    const navamsaLagna =
        getNavamsaSign(
            siderealLagna
        );


    const lagnaNakshatra =
        getNakshatra(
            siderealLagna
        );


    kundali.Lagna = {

        ...rashiPosition(
            siderealLagna
        ),


        longitude:
            siderealLagna,


        // ==============================
        // LAGNA NAKSHATRA
        // ==============================

        nakshatra:
            lagnaNakshatra.nakshatra,

        nakshatraLord:
            lagnaNakshatra.nakshatraLord,

        subLord:
            lagnaNakshatra.subLord,

        sookshmaDaipathi:
            lagnaNakshatra.sookshmaDaipathi,

        pada:
            lagnaNakshatra.pada,

        nakshatraIndex:
            lagnaNakshatra.nakshatraIndex,


        // ==============================
        // LAGNA NAVAMSA
        // ==============================

        navamsaRashi:
            navamsaLagna.sign,

        navamsaSignIndex:
            navamsaLagna.signIndex,

        navamsaNumber:
            navamsaLagna.navamsaNumber,

        degreeInNavamsa:
            navamsaLagna.degreeInNavamsa

    };


    // ======================================
    // HOUSE CALCULATION
    // ======================================

    const lagnaIndex =
        rashis.indexOf(
            kundali.Lagna.rashi
        );


    const mandhiRashiIndex =
        rashis.indexOf(
            mandhi.rashi
        );


    let mandhiHouse =
        mandhiRashiIndex -
        lagnaIndex +
        1;


    if (mandhiHouse <= 0) {

        mandhiHouse += 12;

    }


    mandhi.house =
        mandhiHouse;


    // ======================================
    // PLANETS DATA
    // ======================================

    let planetsData = [];


    for (const planet in kundali) {

        if (planet === "Lagna") {

            continue;

        }


        const planetIndex =
            rashis.indexOf(
                kundali[planet].rashi
            );


        let house =
            planetIndex -
            lagnaIndex +
            1;


        if (house <= 0) {

            house += 12;

        }


        planetsData.push({

            planet,

            house,

            rashi:
                kundali[planet].rashi,

            degree:
                kundali[planet].degree,

            longitude:
                kundali[planet].longitude,

            speed:
                kundali[planet].speed,

            retrograde:
                kundali[planet].retrograde,

            combust:
                kundali[planet].combust,

            sunDistance:
                Number(
                    (
                        kundali[planet]
                            .sunDistance || 0
                    ).toFixed(4)
                ),


            // ==============================
            // NAKSHATRA
            // ==============================

            nakshatra:
                kundali[planet].nakshatra,

            nakshatraLord:
                kundali[planet].nakshatraLord,

            subLord:
                kundali[planet].subLord,

            sookshmaDaipathi:
                kundali[planet]
                    .sookshmaDaipathi,

            pada:
                kundali[planet].pada,

            nakshatraIndex:
                kundali[planet]
                    .nakshatraIndex,


            // ==============================
            // NAVAMSA / D9
            // ==============================

            navamsaRashi:
                kundali[planet]
                    .navamsaRashi,

            navamsaSignIndex:
                kundali[planet]
                    .navamsaSignIndex,

            navamsaNumber:
                kundali[planet]
                    .navamsaNumber,

            degreeInNavamsa:
                kundali[planet]
                    .degreeInNavamsa,


            // ==============================
            // MANDHI
            // ==============================

            mandhi

        });

    }


    // ======================================
    // PANCHANG
    // ======================================

    const panchangData =
        panchang.calculate(
            kundali.Sun.longitude,
            kundali.Moon.longitude,
            date
        );


    // ======================================
    // DASHA
    // ======================================

    const dashaData =
        dasha.calculate(
            kundali.Moon.longitude,
            date
        );

        // ======================================
// SHADBALA
// ======================================

const shadbalaData =
    calculateShadbala(

        kundali,

        planetsData,

        `${date}T${time}:00`

    );

console.log(
    "SHADBALA:",
    shadbalaData
);

// ======================================
// VARGA CHARTS
// ======================================

const vargaData =
   await  calculateVargas(
        kundali
    );

console.log(
    "VARGA DATA:",
    vargaData
);


// ======================================
// YOGA DETECTION
// ======================================

const yogaData =
    detectYogas(
        kundali
    );

console.log(
    "YOGA DATA:",
    yogaData
);
// ======================================
// DOSHA DETECTION
// ======================================

const doshaData =
    dosha.calculateDoshas(
        kundali,
        planetsData
    );

console.log(
    "DOSHA DATA:",
    doshaData
);

    // ======================================
    // FINAL RESPONSE
    // ======================================

    return {

        name,


        birth: {

            date,

            time,

            latitude,

            longitude,

            timezone

        },


        // ==============================
        // D1 LAGNA
        // ==============================

        lagna:
            kundali.Lagna,


        // ==============================
        // PLANETS
        // ==============================

        planets:
            planetsData,


        // ==============================
        // PANCHANG
        // ==============================

        panchang:
            panchangData,


        // ==============================
        // DASHA
        // ==============================

        dasha:
            dashaData,


        // ==============================
        // MANDHI
        // ==============================

        mandhi,


    // ======================================
    // VARGA
    // ======================================

    vargas:
        vargaData,


    // ======================================
    // YOGA
    // ======================================

    yogas:
        yogaData,


    shadbala:
        shadbalaData,
        doshas:
    doshaData
    

    };

}
// ==========================================
// EXPORT
// ==========================================

module.exports = {

    generate

};