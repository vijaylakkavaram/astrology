const swe = require("sweph");
const panchang = require("./panchang");
const dasha = require("./dasha");

// ----------------------------------
// Setup
// ----------------------------------

swe.set_ephe_path("./ephe");

// Lahiri Ayanamsa
swe.set_sid_mode(1, 0, 0);


// ----------------------------------
// Rashis
// ----------------------------------

// ----------------------------------
// Mandhi / Gulika Calculation
// ----------------------------------

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

    const riseFlags = 1; // SE_CALC_RISE
    const setFlags = 2;  // SE_CALC_SET

    const rise = swe.rise_trans(
        jd,
        0,              // Sun
        "",
        0,
        riseFlags,
        geopos,
        1013.25,
        15
    );

    const set = swe.rise_trans(
        jd,
        0,              // Sun
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
function calculateMandhi(
    jd,
    latitude,
    longitude
) {

    const {
        sunrise,
        sunset
    } = getSunriseSunset(
        jd,
        latitude,
        longitude
    );


    // ----------------------------------
    // Weekday
    // 0 = Sunday
    // 1 = Monday
    // ...
    // 6 = Saturday
    // ----------------------------------

    const weekday =
        Math.floor(
            (jd + 1.5) % 7
        );


    // ----------------------------------
    // Common Gulika/Mandhi segment
    // ----------------------------------

    const daySegment = {

        0: 7, // Sunday
        1: 6, // Monday
        2: 5, // Tuesday
        3: 4, // Wednesday
        4: 3, // Thursday
        5: 2, // Friday
        6: 1  // Saturday

    };


    const segmentNumber =
        daySegment[weekday];


    // ----------------------------------
    // Day duration
    // ----------------------------------

    const dayDuration =
        sunset - sunrise;


    const segmentDuration =
        dayDuration / 8;


    // ----------------------------------
    // Middle of Mandhi segment
    // ----------------------------------

    const mandhiJD =
        sunrise +
        (
            (segmentNumber - 1) *
            segmentDuration
        ) +
        (
            segmentDuration / 2
        );


    // ----------------------------------
    // Calculate Ascendant at Mandhi time
    // ----------------------------------

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


// ----------------------------------
// Normalize
// ----------------------------------

function normalize(x) {

    x = x % 360;

    if (x < 0) {
        x += 360;
    }

    return x;
}


// ----------------------------------
// Rashi Position
// ----------------------------------

function rashiPosition(deg) {

    deg = normalize(deg);

    return {

        longitude: deg,

        rashi:
            rashis[Math.floor(deg / 30)],

        degree:
            Number(
                (deg % 30).toFixed(2)
            )

    };
}


// ----------------------------------
// Nakshatras
// ----------------------------------

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


// ----------------------------------
// Nakshatra Calculation
// ----------------------------------

function getNakshatra(longitude) {

    longitude = normalize(longitude);

    // 13°20'
    const nakshatraSize =
        360 / 27;

    // 3°20'
    const padaSize =
        nakshatraSize / 4;

    const nakshatraIndex =
        Math.floor(
            longitude / nakshatraSize
        );

    const nakshatraStart =
        nakshatraIndex *
        nakshatraSize;

    const positionInNakshatra =
        longitude -
        nakshatraStart;

    const pada =
        Math.floor(
            positionInNakshatra /
            padaSize
        ) + 1;

    return {

        nakshatra:
            nakshatras[nakshatraIndex],

        pada,

        nakshatraIndex:
            nakshatraIndex + 1,

        degreeInNakshatra:
            Number(
                positionInNakshatra.toFixed(4)
            )

    };
}


// ----------------------------------
// Planets
// ----------------------------------

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


// ----------------------------------
// Combustion Calculation
// ----------------------------------

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


// Common approximate Vedic
// combustion limits.
//
// Different traditions may use
// slightly different limits.

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

    // Sun cannot be combust
    if (planet === "Sun") {
        return false;
    }

    // Rahu/Ketu are not treated
    // as combust in this implementation
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


// ----------------------------------
// Generate Kundali
// ----------------------------------

async function generate(data) {

    console.log(
        "Data received:",
        data
    );

    const {

        name,

        date,

        time,

        latitude,

        longitude,

        timezone

    } = data;


    // ----------------------------------
    // Date & Time
    // ----------------------------------

    const [year, month, day] =
        date
            .split("-")
            .map(Number);

    const [hour, minute] =
        time
            .split(":")
            .map(Number);


    // ----------------------------------
    // Local Time -> UTC
    // ----------------------------------

    const hourUTC =
        hour +
        minute / 60 -
        Number(timezone);


    // ----------------------------------
    // Julian Day
    // ----------------------------------

    const jd =
        swe.julday(
            year,
            month,
            day,
            hourUTC,
            1
        );


    let kundali = {};


    // ----------------------------------
    // IMPORTANT FLAGS
    // ----------------------------------
    //
    // 65536 = SIDEREAL
    // 256   = SPEED
    //
    // Speed is required to detect
    // retrograde motion.
    // ----------------------------------

    const flags =
        65536 | 256;


    // ----------------------------------
    // Planet Positions
    // ----------------------------------

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


        const nakshatra =
            getNakshatra(
                planetLongitude
            );


        kundali[name] = {

            ...rashiPosition(
                planetLongitude
            ),

            longitude:
                planetLongitude,

            speed,

            // Negative speed = retrograde
            retrograde:
                speed < 0,

            nakshatra:
                nakshatra.nakshatra,

            pada:
                nakshatra.pada,

            nakshatraIndex:
                nakshatra.nakshatraIndex

        };

    }


    // ----------------------------------
    // Sun Longitude
    // ----------------------------------

    const sunLongitude =
        kundali.Sun.longitude;


    // ----------------------------------
    // Retrograde + Combustion
    // ----------------------------------

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


    // ----------------------------------
    // Ketu
    // ----------------------------------

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


    kundali.Ketu = {

        ...rashiPosition(
            ketuLongitude
        ),

        longitude:
            ketuLongitude,

        // Ketu follows the node's
        // apparent retrograde motion
        speed:
            kundali.Rahu.speed,

        retrograde: true,

        combust: false,

        sunDistance:
            getAngularDistance(
                ketuLongitude,
                sunLongitude
            ),

        nakshatra:
            ketuNakshatra.nakshatra,

        pada:
            ketuNakshatra.pada,

        nakshatraIndex:
            ketuNakshatra.nakshatraIndex

    };


    // ----------------------------------
    // Lagna
    // ----------------------------------

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
            lagna - ayanamsa
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

        nakshatra:
            lagnaNakshatra.nakshatra,

        pada:
            lagnaNakshatra.pada,

        nakshatraIndex:
            lagnaNakshatra.nakshatraIndex

    };


    // ----------------------------------
    // Calculate Houses
    // ----------------------------------

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
    mandhi: mandhi,

    

            nakshatra:
                kundali[planet].nakshatra,

            pada:
                kundali[planet].pada,

            nakshatraIndex:
                kundali[planet]
                    .nakshatraIndex

        });

    }


    console.log(
        "Planet Details:",
        planetsData
    );


    // ----------------------------------
    // Panchang
    // ----------------------------------

    const panchangData =
        panchang.calculate(

            kundali.Sun.longitude,

            kundali.Moon.longitude,

            date

        );


    // ----------------------------------
    // Dasha
    // ----------------------------------

    const dashaData =
        dasha.calculate(

            kundali.Moon.longitude,

            date

        );


    // ----------------------------------
    // Return
    // ----------------------------------

    return {

        name,

        birth: {

            date,

            time,

            latitude,

            longitude,

            timezone

        },


        lagna:
            kundali.Lagna,


        planets:
            planetsData,


        panchang:
            panchangData,


        dasha:
            dashaData,


            
    mandhi:
        mandhi,

        // ----------------------------------
        // Nakshatra Card Data
        // ----------------------------------

       

    };

}


// ----------------------------------
// Export
// ----------------------------------

module.exports = {

    generate

};