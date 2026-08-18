const {
    julianDay,
    calculatePosition,
    Planet,
    setSiderealMode,
    SiderealMode,
    CalculationFlag
} = require("@swisseph/node");


// ============================================================
// Constants
// ============================================================

const TITHIS = [
    "Shukla Pratipada",
    "Shukla Dwitiya",
    "Shukla Tritiya",
    "Shukla Chaturthi",
    "Shukla Panchami",
    "Shukla Shashthi",
    "Shukla Saptami",
    "Shukla Ashtami",
    "Shukla Navami",
    "Shukla Dashami",
    "Shukla Ekadashi",
    "Shukla Dwadashi",
    "Shukla Trayodashi",
    "Shukla Chaturdashi",
    "Purnima",

    "Krishna Pratipada",
    "Krishna Dwitiya",
    "Krishna Tritiya",
    "Krishna Chaturthi",
    "Krishna Panchami",
    "Krishna Shashthi",
    "Krishna Saptami",
    "Krishna Ashtami",
    "Krishna Navami",
    "Krishna Dashami",
    "Krishna Ekadashi",
    "Krishna Dwadashi",
    "Krishna Trayodashi",
    "Krishna Chaturdashi",
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


const YOGAS = [
    "Vishkumbha",
    "Priti",
    "Ayushman",
    "Saubhagya",
    "Shobhana",
    "Atiganda",
    "Sukarma",
    "Dhriti",
    "Shula",
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


const WEEKDAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];


const KARANAS = [
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


// ============================================================
// Utility
// ============================================================

function normalize(value) {

    value %= 360;

    if (value < 0) {
        value += 360;
    }

    return value;
}


function pad(value) {
    return String(value).padStart(2, "0");
}


function formatTime(date) {

    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}


function minutesToTime(minutes) {

    minutes = Math.round(minutes);

    minutes = Math.max(0, Math.min(1439, minutes));

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${pad(hours)}:${pad(mins)}`;
}


function timeToMinutes(time) {

    const [hours, minutes] = time.split(":").map(Number);

    return hours * 60 + minutes;
}


function localDateToUTC(dateString, timezoneOffsetMinutes) {

    const [year, month, day] = dateString
        .split("-")
        .map(Number);

    return new Date(
        Date.UTC(
            year,
            month - 1,
            day,
            0,
            -timezoneOffsetMinutes
        )
    );
}


// ============================================================
// Julian Day
// ============================================================

function getJulianDay(date) {

    return julianDay(
        date.getUTCFullYear(),
        date.getUTCMonth() + 1,
        date.getUTCDate(),
        date.getUTCHours() +
        date.getUTCMinutes() / 60 +
        date.getUTCSeconds() / 3600
    );
}


// ============================================================
// Planet positions
// ============================================================

function getSiderealPositions(jd) {

    setSiderealMode(SiderealMode.Lahiri);

    const flags =
        CalculationFlag.SwissEphemeris |
        CalculationFlag.Sidereal;

    const sun = calculatePosition(
        jd,
        Planet.Sun,
        flags
    );

    const moon = calculatePosition(
        jd,
        Planet.Moon,
        flags
    );

    return {
        sun: normalize(sun.longitude),
        moon: normalize(moon.longitude)
    };
}


// ============================================================
// Panchanga
// ============================================================

function calculateTithi(sun, moon) {

    const difference =
        normalize(moon - sun);

    const index =
        Math.floor(difference / 12);

    const percentage =
        ((difference % 12) / 12) * 100;

    return {
        index: index + 1,
        name: TITHIS[index],
        percentage: Number(percentage.toFixed(2))
    };
}


function calculateNakshatra(moon) {

    const span = 360 / 27;

    const index =
        Math.floor(moon / span);

    const percentage =
        ((moon % span) / span) * 100;

    return {
        index: index + 1,
        name: NAKSHATRAS[index],
        percentage: Number(percentage.toFixed(2))
    };
}


function calculateYoga(sun, moon) {

    const total =
        normalize(sun + moon);

    const span = 360 / 27;

    const index =
        Math.floor(total / span);

    const percentage =
        ((total % span) / span) * 100;

    return {
        index: index + 1,
        name: YOGAS[index],
        percentage: Number(percentage.toFixed(2))
    };
}


function calculateKarana(tithi) {

    const halfTithi =
        Math.floor(
            ((tithi.index - 1) * 2)
        );

    const movable = [
        "Bava",
        "Balava",
        "Kaulava",
        "Taitila",
        "Garaja",
        "Vanija",
        "Vishti"
    ];

    let name;

    if (halfTithi === 0) {

        name = "Kimstughna";

    } else if (halfTithi >= 57) {

        const fixed = [
            "Shakuni",
            "Chatushpada",
            "Naga"
        ];

        name =
            fixed[halfTithi - 57] ||
            "Naga";

    } else {

        name =
            movable[(halfTithi - 1) % 7];
    }

    return {
        name
    };
}


// ============================================================
// Sunrise / Sunset
// NOAA approximation
// ============================================================

function calculateSunEvent(
    dateString,
    latitude,
    longitude,
    isSunrise
) {

    const [year, month, day] =
        dateString.split("-").map(Number);

    const N =
        Math.floor(
            (new Date(
                Date.UTC(year, month - 1, day)
            ) -
                new Date(
                    Date.UTC(year, 0, 0)
                )) /
            86400000
        );

    const lngHour = longitude / 15;

    const t = isSunrise
        ? N + ((6 - lngHour) / 24)
        : N + ((18 - lngHour) / 24);

    const M =
        (0.9856 * t) - 3.289;

    let L =
        M +
        (1.916 * Math.sin(M * Math.PI / 180)) +
        (0.020 * Math.sin(2 * M * Math.PI / 180)) +
        282.634;

    L = normalize(L);

    let RA =
        Math.atan(
            0.91764 *
            Math.tan(L * Math.PI / 180)
        ) *
        180 /
        Math.PI;

    RA = normalize(RA);

    const Lquadrant =
        Math.floor(L / 90) * 90;

    const RAquadrant =
        Math.floor(RA / 90) * 90;

    RA =
        RA +
        (Lquadrant - RAquadrant);

    RA /= 15;

    const sinDec =
        0.39782 *
        Math.sin(L * Math.PI / 180);

    const cosDec =
        Math.cos(
            Math.asin(sinDec)
        );

    const zenith = 90.833;

    const cosH =
        (
            Math.cos(zenith * Math.PI / 180) -
            (
                sinDec *
                Math.sin(latitude * Math.PI / 180)
            )
        ) /
        (
            cosDec *
            Math.cos(latitude * Math.PI / 180)
        );

    if (cosH > 1 || cosH < -1) {

        return null;
    }

    let H;

    if (isSunrise) {

        H =
            360 -
            Math.acos(cosH) *
            180 /
            Math.PI;

    } else {

        H =
            Math.acos(cosH) *
            180 /
            Math.PI;
    }

    H /= 15;

    const T =
        H +
        RA -
        (0.06571 * t) -
        6.622;

    let UT =
        (T - lngHour) % 24;

    if (UT < 0) {
        UT += 24;
    }

    const utc =
        new Date(
            Date.UTC(
                year,
                month - 1,
                day,
                0,
                0,
                0
            )
        );

    utc.setUTCMinutes(
        Math.round(UT * 60)
    );

    return utc;
}


// ============================================================
// Convert UTC to requested timezone
// ============================================================

function getTimezoneParts(
    date,
    timezone
) {

    const formatter =
        new Intl.DateTimeFormat(
            "en-US",
            {
                timeZone: timezone,
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            }
        );

    return formatter
        .formatToParts(date)
        .reduce((result, part) => {

            result[part.type] = part.value;

            return result;

        }, {});
}


function formatTimezoneTime(
    date,
    timezone
) {

    const parts =
        getTimezoneParts(
            date,
            timezone
        );

    return `${parts.hour}:${parts.minute}`;
}


// ============================================================
// Daytime intervals
// ============================================================

function buildDayIntervals(
    sunrise,
    sunset
) {

    const sunriseMs =
        sunrise.getTime();

    const sunsetMs =
        sunset.getTime();

    const duration =
        (sunsetMs - sunriseMs) /
        8;

    return Array.from(
        { length: 8 },
        (_, index) => {

            const start =
                new Date(
                    sunriseMs +
                    duration * index
                );

            const end =
                new Date(
                    sunriseMs +
                    duration * (index + 1)
                );

            return {
                start,
                end
            };
        }
    );
}


function buildNightIntervals(
    sunset,
    nextSunrise
) {

    const sunsetMs =
        sunset.getTime();

    const sunriseMs =
        nextSunrise.getTime();

    const duration =
        (sunriseMs - sunsetMs) /
        8;

    return Array.from(
        { length: 8 },
        (_, index) => {

            return {
                start: new Date(
                    sunsetMs +
                    duration * index
                ),
                end: new Date(
                    sunsetMs +
                    duration * (index + 1)
                )
            };

        }
    );
}


// ============================================================
// Rahu Kalam / Yamaganda / Gulika
// ============================================================

const RAHU_INDEX = [
    1, // Sunday
    6, // Monday
    4, // Tuesday
    5, // Wednesday
    3, // Thursday
    2, // Friday
    7  // Saturday
];


const YAMAGANDA_INDEX = [
    5,
    4,
    3,
    2,
    1,
    7,
    6
];


const GULIKA_INDEX = [
    7,
    6,
    5,
    4,
    3,
    2,
    1
];


function getInterval(
    intervals,
    index
) {

    const item =
        intervals[index - 1];

    if (!item) {
        return null;
    }

    return {
        start: item.start,
        end: item.end
    };
}


// ============================================================
// Choghadiya
// ============================================================

const DAY_CHOGHADIYA = [
    ["Udveg", "Chal", "Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg"],
    ["Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Chal", "Labh", "Amrit"],
    ["Rog", "Udveg", "Chal", "Labh", "Amrit", "Kaal", "Shubh", "Rog"],
    ["Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Chal", "Labh"],
    ["Shubh", "Rog", "Udveg", "Chal", "Labh", "Amrit", "Kaal", "Shubh"],
    ["Chal", "Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Chal"],
    ["Kaal", "Shubh", "Rog", "Udveg", "Chal", "Labh", "Amrit", "Kaal"]
];


const GOOD_CHOGHADIYA = [
    "Amrit",
    "Shubh",
    "Labh",
    "Chal"
];


function calculateChoghadiya(
    sunrise,
    sunset,
    weekday
) {

    const intervals =
        buildDayIntervals(
            sunrise,
            sunset
        );

    const names =
        DAY_CHOGHADIYA[weekday];

    return intervals.map(
        (interval, index) => ({
            name: names[index],
            start: interval.start,
            end: interval.end,
            auspicious:
                GOOD_CHOGHADIYA.includes(
                    names[index]
                )
        })
    );
}


// ============================================================
// Abhijit Muhurat
// ============================================================

function calculateAbhijit(
    sunrise,
    sunset
) {

    const midday =
        sunrise.getTime() +
        (
            sunset.getTime() -
            sunrise.getTime()
        ) / 2;

    const duration =
        (
            sunset.getTime() -
            sunrise.getTime()
        ) / 15;

    return {
        start: new Date(
            midday - duration / 2
        ),
        end: new Date(
            midday + duration / 2
        )
    };
}


// ============================================================
// Muhurat rules
// ============================================================

const RULES = {

    marriage: {

        allowedWeekdays: [
            1,
            3,
            4,
            5
        ],

        goodTithis: [
            2,
            3,
            5,
            7,
            10,
            11,
            13,
            15,
            17,
            19,
            21,
            22,
            24,
            25,
            27,
            29
        ],

        goodNakshatras: [
            "Rohini",
            "Mrigashira",
            "Magha",
            "Uttara Phalguni",
            "Hasta",
            "Swati",
            "Anuradha",
            "Mula",
            "Uttara Ashadha",
            "Shravana",
            "Dhanishtha",
            "Uttara Bhadrapada",
            "Revati"
        ],

        badNakshatras: [
            "Ardra",
            "Ashlesha",
            "Jyeshtha"
        ]
    },


    grihaPravesh: {

        allowedWeekdays: [
            1,
            3,
            4,
            5
        ],

        goodTithis: [
            2,
            3,
            5,
            7,
            10,
            11,
            13,
            15
        ],

        goodNakshatras: [
            "Rohini",
            "Mrigashira",
            "Punarvasu",
            "Pushya",
            "Hasta",
            "Anuradha",
            "Shravana",
            "Dhanishtha",
            "Shatabhisha",
            "Uttara Bhadrapada",
            "Revati"
        ]
    },


    vehicle: {

        allowedWeekdays: [
            1,
            3,
            4,
            5,
            6
        ],

        goodTithis: [
            2,
            3,
            5,
            7,
            10,
            11,
            13,
            15
        ],

        goodNakshatras: [
            "Ashwini",
            "Rohini",
            "Mrigashira",
            "Punarvasu",
            "Pushya",
            "Hasta",
            "Chitra",
            "Swati",
            "Anuradha",
            "Shravana",
            "Dhanishtha",
            "Revati"
        ]
    },


    property: {

        allowedWeekdays: [
            1,
            3,
            4,
            5
        ],

        goodTithis: [
            2,
            3,
            5,
            7,
            10,
            11,
            13,
            15
        ],

        goodNakshatras: [
            "Rohini",
            "Mrigashira",
            "Punarvasu",
            "Pushya",
            "Hasta",
            "Chitra",
            "Anuradha",
            "Shravana",
            "Dhanishtha",
            "Uttara Bhadrapada",
            "Revati"
        ]
    },


    naming: {

        allowedWeekdays: [
            1,
            3,
            4,
            5,
            6
        ],

        goodTithis: [
            2,
            3,
            5,
            7,
            10,
            11,
            13,
            15
        ],

        goodNakshatras: [
            "Ashwini",
            "Rohini",
            "Mrigashira",
            "Punarvasu",
            "Pushya",
            "Hasta",
            "Chitra",
            "Swati",
            "Anuradha",
            "Shravana",
            "Dhanishtha",
            "Revati"
        ]
    }
};


// ============================================================
// Score
// ============================================================

function calculateMuhuratScore(
    type,
    panchanga,
    weekday
) {

    const rules =
        RULES[type];

    if (!rules) {

        return {
            score: 50,
            quality: "General"
        };
    }

    let score = 50;

    const reasons = [];
    const warnings = [];

    if (
        rules.allowedWeekdays.includes(
            weekday
        )
    ) {

        score += 15;

        reasons.push(
            "Favorable weekday"
        );

    } else {

        score -= 15;

        warnings.push(
            "Weekday is generally avoided"
        );
    }


    if (
        rules.goodTithis.includes(
            panchanga.tithi.index
        )
    ) {

        score += 15;

        reasons.push(
            "Favorable tithi"
        );

    } else {

        score -= 10;

        warnings.push(
            "Tithi is not in the preferred list"
        );
    }


    if (
        rules.goodNakshatras.includes(
            panchanga.nakshatra.name
        )
    ) {

        score += 20;

        reasons.push(
            "Favorable nakshatra"
        );

    } else {

        score -= 10;

        warnings.push(
            "Nakshatra is not in the preferred list"
        );
    }


    if (
        rules.badNakshatras &&
        rules.badNakshatras.includes(
            panchanga.nakshatra.name
        )
    ) {

        score -= 20;

        warnings.push(
            "Nakshatra is traditionally avoided"
        );
    }


    if (
        [
            "Vishkumbha",
            "Atiganda",
            "Shula",
            "Ganda",
            "Vyaghata",
            "Vajra",
            "Vyatipata",
            "Parigha",
            "Vaidhriti"
        ].includes(
            panchanga.yoga.name
        )
    ) {

        score -= 10;

        warnings.push(
            `Yoga ${panchanga.yoga.name} requires caution`
        );

    } else {

        score += 5;

        reasons.push(
            "Yoga is acceptable"
        );
    }


    score =
        Math.max(
            0,
            Math.min(100, score)
        );


    let quality;

    if (score >= 80) {

        quality = "Highly Auspicious";

    } else if (score >= 65) {

        quality = "Auspicious";

    } else if (score >= 50) {

        quality = "Average";

    } else {

        quality = "Avoid";
    }


    return {
        score,
        quality,
        reasons,
        warnings
    };
}


// ============================================================
// Main calculation
// ============================================================

async function calculateMuhurat({
    date,
    latitude,
    longitude,
    timezone = "Asia/Kolkata",
    type = "general"
}) {

    if (!date) {
        throw new Error("date is required");
    }

    if (
        typeof latitude !== "number" ||
        typeof longitude !== "number"
    ) {

        throw new Error(
            "latitude and longitude are required"
        );
    }


    // Get approximate UTC midnight.
    const baseUTC =
        new Date(
            `${date}T00:00:00Z`
        );


    // Sunrise / sunset calculation
    const sunrise =
        calculateSunEvent(
            date,
            latitude,
            longitude,
            true
        );

    const sunset =
        calculateSunEvent(
            date,
            latitude,
            longitude,
            false
        );


    if (!sunrise || !sunset) {

        throw new Error(
            "Unable to calculate sunrise/sunset"
        );
    }


    // JD at sunrise
    const jd =
        getJulianDay(
            sunrise
        );


    const positions =
        getSiderealPositions(jd);


    const tithi =
        calculateTithi(
            positions.sun,
            positions.moon
        );


    const nakshatra =
        calculateNakshatra(
            positions.moon
        );


    const yoga =
        calculateYoga(
            positions.sun,
            positions.moon
        );


    const karana =
        calculateKarana(
            tithi
        );


    const weekday =
        baseUTC.getUTCDay();


    const panchanga = {

        tithi,
        nakshatra,
        yoga,
        karana,

        vara: WEEKDAYS[weekday]
    };


    // Day intervals
    const dayIntervals =
        buildDayIntervals(
            sunrise,
            sunset
        );


    const rahu =
        getInterval(
            dayIntervals,
            RAHU_INDEX[weekday]
        );


    const yamaganda =
        getInterval(
            dayIntervals,
            YAMAGANDA_INDEX[weekday]
        );


    const gulika =
        getInterval(
            dayIntervals,
            GULIKA_INDEX[weekday]
        );


    const abhijit =
        calculateAbhijit(
            sunrise,
            sunset
        );


    const choghadiya =
        calculateChoghadiya(
            sunrise,
            sunset,
            weekday
        );


    const score =
        calculateMuhuratScore(
            type,
            panchanga,
            weekday
        );


    const blockedIntervals = [
        {
            name: "Rahu Kalam",
            start: rahu.start,
            end: rahu.end
        },
        {
            name: "Yamaganda",
            start: yamaganda.start,
            end: yamaganda.end
        },
        {
            name: "Gulika Kalam",
            start: gulika.start,
            end: gulika.end
        }
    ];


    return {

        success: true,

        date,

        location: {
            latitude,
            longitude,
            timezone
        },

        muhuratType: type,

        panchanga,

        planetaryPositions: {
            sun: Number(
                positions.sun.toFixed(6)
            ),
            moon: Number(
                positions.moon.toFixed(6)
            )
        },

        sunrise:
            formatTimezoneTime(
                sunrise,
                timezone
            ),

        sunset:
            formatTimezoneTime(
                sunset,
                timezone
            ),

        rahuKalam: {
            start:
                formatTimezoneTime(
                    rahu.start,
                    timezone
                ),
            end:
                formatTimezoneTime(
                    rahu.end,
                    timezone
                )
        },

        yamaganda: {
            start:
                formatTimezoneTime(
                    yamaganda.start,
                    timezone
                ),
            end:
                formatTimezoneTime(
                    yamaganda.end,
                    timezone
                )
        },

        gulikaKalam: {
            start:
                formatTimezoneTime(
                    gulika.start,
                    timezone
                ),
            end:
                formatTimezoneTime(
                    gulika.end,
                    timezone
                )
        },

        abhijitMuhurat: {
            start:
                formatTimezoneTime(
                    abhijit.start,
                    timezone
                ),
            end:
                formatTimezoneTime(
                    abhijit.end,
                    timezone
                )
        },

        choghadiya:
            choghadiya.map(item => ({
                name: item.name,
                start:
                    formatTimezoneTime(
                        item.start,
                        timezone
                    ),
                end:
                    formatTimezoneTime(
                        item.end,
                        timezone
                    ),
                auspicious:
                    item.auspicious
            })),

        evaluation: score,

        blockedPeriods:
            blockedIntervals.map(
                item => ({
                    name: item.name,
                    start:
                        formatTimezoneTime(
                            item.start,
                            timezone
                        ),
                    end:
                        formatTimezoneTime(
                            item.end,
                            timezone
                        )
                })
            )
    };
}


// ============================================================
// Find good Muhurats in a date range
// ============================================================

async function findMuhurats({
    startDate,
    days = 30,
    latitude,
    longitude,
    timezone = "Asia/Kolkata",
    type = "marriage"
}) {

    const results = [];

    const start =
        new Date(
            `${startDate}T00:00:00Z`
        );


    for (
        let i = 0;
        i < days;
        i++
    ) {

        const current =
            new Date(start);

        current.setUTCDate(
            current.getUTCDate() + i
        );


        const date =
            current.toISOString()
                .slice(0, 10);


        try {

            const result =
                await calculateMuhurat({
                    date,
                    latitude,
                    longitude,
                    timezone,
                    type
                });


            if (
                result.evaluation.score >= 65
            ) {

                results.push(result);
            }

        } catch (error) {

            console.error(
                `Muhurat calculation failed for ${date}:`,
                error.message
            );
        }
    }


    return {
        success: true,
        type,
        startDate,
        days,
        results
    };
}


module.exports = {
    calculateMuhurat,
    findMuhurats
};
