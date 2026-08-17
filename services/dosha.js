// =====================================================
// DOSHA CALCULATION
// =====================================================
//
// This module calculates commonly used Vedic astrology
// doshas from the already calculated planetary positions.
//
// Input:
//   kundali      -> raw planetary data
//   planetsData  -> planets with house information
//
// Output:
//   structured dosha information for frontend
//
// =====================================================


// =====================================================
// CONSTANTS
// =====================================================

const PLANETS_FOR_KAAL_SARP = [
    "Sun",
    "Moon",
    "Mars",
    "Mercury",
    "Jupiter",
    "Venus",
    "Saturn"
];


// =====================================================
// HELPERS
// =====================================================

function getPlanet(planetsData, name) {

    return planetsData.find(
        p => p.planet === name
    ) || null;

}


function getHouse(planetsData, name) {

    const planet = getPlanet(
        planetsData,
        name
    );

    return planet
        ? Number(planet.house)
        : null;

}


function getLongitude(planetsData, name) {

    const planet = getPlanet(
        planetsData,
        name
    );

    return planet
        ? Number(planet.longitude)
        : null;

}


function houseDistance(fromHouse, toHouse) {

    if (
        fromHouse === null ||
        toHouse === null
    ) {
        return null;
    }

    return (
        (
            toHouse -
            fromHouse +
            12
        ) % 12
    ) + 1;

}


function isManglikHouse(house) {

    return [
        1,
        4,
        7,
        8,
        12
    ].includes(house);

}


// =====================================================
// MANGAL / KUJA DOSHA
// =====================================================
//
// Commonly checked from:
//   1. Lagna
//   2. Moon
//   3. Venus
//
// Houses:
//   1, 4, 7, 8, 12
//
// NOTE:
// Cancellation/Bhanga rules are returned separately
// so they can be expanded later.
// =====================================================

function calculateManglik(
    kundali,
    planetsData
) {

    const marsHouse =
        getHouse(
            planetsData,
            "Mars"
        );

    const moonHouse =
        getHouse(
            planetsData,
            "Moon"
        );

    const venusHouse =
        getHouse(
            planetsData,
            "Venus"
        );

    const lagnaHouse = 1;


    const fromLagna =
        isManglikHouse(
            marsHouse
        );


    const marsFromMoon =
        houseDistance(
            moonHouse,
            marsHouse
        );


    const marsFromVenus =
        houseDistance(
            venusHouse,
            marsHouse
        );


    const fromMoon =
        isManglikHouse(
            marsFromMoon
        );


    const fromVenus =
        isManglikHouse(
            marsFromVenus
        );


    const present =
        fromLagna ||
        fromMoon ||
        fromVenus;


    let severity = "none";


    if (present) {

        const count =
            [
                fromLagna,
                fromMoon,
                fromVenus
            ]
            .filter(Boolean)
            .length;


        if (count >= 3) {

            severity = "high";

        } else if (count === 2) {

            severity = "medium";

        } else {

            severity = "mild";

        }

    }


    return {

        present,

        severity,

        marsHouse,

        fromLagna,

        fromMoon,

        fromVenus,

        marsFromMoon,

        marsFromVenus,

        cancellations: [],

        reason: present

            ? "Mars occupies a Manglik position from one or more reference points."

            : "Mars does not occupy the specified Manglik houses from Lagna, Moon or Venus."

    };

}


// =====================================================
// GURU CHANDAL DOSHA
// =====================================================
//
// Jupiter with Rahu or Ketu in the same sign/house.
//
// =====================================================

function calculateGuruChandal(
    kundali,
    planetsData
) {

    const jupiter =
        getPlanet(
            planetsData,
            "Jupiter"
        );

    const rahu =
        getPlanet(
            planetsData,
            "Rahu"
        );

    const ketu =
        getPlanet(
            planetsData,
            "Ketu"
        );


    if (
        !jupiter ||
        !rahu ||
        !ketu
    ) {

        return {
            present: false,
            withRahu: false,
            withKetu: false,
            reason: "Required planetary data is unavailable."
        };

    }


    const withRahu =
        jupiter.house === rahu.house;


    const withKetu =
        jupiter.house === ketu.house;


    return {

        present:
            withRahu ||
            withKetu,

        withRahu,

        withKetu,

        jupiterHouse:
            jupiter.house,

        rahuHouse:
            rahu.house,

        ketuHouse:
            ketu.house,

        reason:
            withRahu || withKetu

                ? "Jupiter is conjunct Rahu or Ketu."

                : "Jupiter is not conjunct Rahu or Ketu."

    };

}


// =====================================================
// GRAHAN DOSHA
// =====================================================
//
// Solar Grahan:
//   Sun + Rahu/Ketu
//
// Lunar Grahan:
//   Moon + Rahu/Ketu
//
// =====================================================

function calculateGrahan(
    kundali,
    planetsData
) {

    const sun =
        getPlanet(
            planetsData,
            "Sun"
        );

    const moon =
        getPlanet(
            planetsData,
            "Moon"
        );

    const rahu =
        getPlanet(
            planetsData,
            "Rahu"
        );

    const ketu =
        getPlanet(
            planetsData,
            "Ketu"
        );


    if (
        !sun ||
        !moon ||
        !rahu ||
        !ketu
    ) {

        return {
            present: false,
            solar: false,
            lunar: false,
            reason: "Required planetary data is unavailable."
        };

    }


    const solarWithRahu =
        sun.house === rahu.house;


    const solarWithKetu =
        sun.house === ketu.house;


    const lunarWithRahu =
        moon.house === rahu.house;


    const lunarWithKetu =
        moon.house === ketu.house;


    const solar =
        solarWithRahu ||
        solarWithKetu;


    const lunar =
        lunarWithRahu ||
        lunarWithKetu;


    return {

        present:
            solar ||
            lunar,

        solar,

        lunar,

        solarWithRahu,

        solarWithKetu,

        lunarWithRahu,

        lunarWithKetu,

        reason:
            solar || lunar

                ? "Sun or Moon is conjunct Rahu/Ketu."

                : "Neither Sun nor Moon is conjunct Rahu/Ketu."

    };

}


// =====================================================
// SHRAPIT DOSHA
// =====================================================
//
// Saturn + Rahu conjunction.
//
// =====================================================

function calculateShrapit(
    kundali,
    planetsData
) {

    const saturn =
        getPlanet(
            planetsData,
            "Saturn"
        );

    const rahu =
        getPlanet(
            planetsData,
            "Rahu"
        );


    if (
        !saturn ||
        !rahu
    ) {

        return {
            present: false,
            reason: "Required planetary data is unavailable."
        };

    }


    const conjunction =
        saturn.house === rahu.house;


    return {

        present:
            conjunction,

        conjunction,

        saturnHouse:
            saturn.house,

        rahuHouse:
            rahu.house,

        reason:
            conjunction

                ? "Saturn and Rahu occupy the same house."

                : "Saturn and Rahu are not in the same house."

    };

}


// =====================================================
// KAAL SARP DOSHA
// =====================================================
//
// Common computational rule:
//
// All seven classical planets
// Sun, Moon, Mars, Mercury, Jupiter,
// Venus and Saturn must lie within
// one side of the Rahu-Ketu axis.
//
// Rahu/Ketu themselves are excluded.
//
// We calculate using longitude rather than simply
// comparing house numbers.
// =====================================================

function normalize360(value) {

    value =
        Number(value) % 360;

    if (value < 0) {

        value += 360;

    }

    return value;

}


function isLongitudeBetween(
    value,
    start,
    end
) {

    value =
        normalize360(value);

    start =
        normalize360(start);

    end =
        normalize360(end);


    if (start < end) {

        return (
            value >= start &&
            value <= end
        );

    }


    return (
        value >= start ||
        value <= end
    );

}


function calculateKaalSarp(
    kundali,
    planetsData
) {

    const rahuLongitude =
        getLongitude(
            planetsData,
            "Rahu"
        );

    const ketuLongitude =
        getLongitude(
            planetsData,
            "Ketu"
        );


    if (
        rahuLongitude === null ||
        ketuLongitude === null
    ) {

        return {

            present: false,

            type: null,

            reason:
                "Rahu/Ketu longitude is unavailable."

        };

    }


    const planetLongitudes =
        PLANETS_FOR_KAAL_SARP
            .map(name => ({

                name,

                longitude:
                    getLongitude(
                        planetsData,
                        name
                    )

            }))
            .filter(
                p =>
                    p.longitude !== null
            );


    // -------------------------------------------------
    // Axis Rahu -> Ketu
    // -------------------------------------------------

    const allBetweenRahuKetu =
        planetLongitudes.every(
            planet =>
                isLongitudeBetween(
                    planet.longitude,
                    rahuLongitude,
                    ketuLongitude
                )
        );


    // -------------------------------------------------
    // Axis Ketu -> Rahu
    // -------------------------------------------------

    const allBetweenKetuRahu =
        planetLongitudes.every(
            planet =>
                isLongitudeBetween(
                    planet.longitude,
                    ketuLongitude,
                    rahuLongitude
                )
        );


    const present =
        allBetweenRahuKetu ||
        allBetweenKetuRahu;


    let type = null;


    if (present) {

        if (allBetweenRahuKetu) {

            type = "Rahu-to-Ketu";

        } else {

            type = "Ketu-to-Rahu";

        }

    }


    return {

        present,

        type,

        rahuLongitude,

        ketuLongitude,

        planetsChecked:
            planetLongitudes,

        reason:
            present

                ? "All seven classical planets are contained within one side of the Rahu-Ketu axis."

                : "The seven classical planets are not contained within one side of the Rahu-Ketu axis."

    };

}


// =====================================================
// KEMADRUMA DOSHA
// =====================================================
//
// Basic traditional check:
//
// Moon has no planet in the 2nd or 12th house
// from Moon.
//
// Sun is generally excluded from this simple check
// because different traditions use different rules.
//
// Cancellation rules can be expanded separately.
// =====================================================

function calculateKemadruma(
    kundali,
    planetsData
) {

    const moon =
        getPlanet(
            planetsData,
            "Moon"
        );


    if (!moon) {

        return {

            present: false,

            cancelled: false,

            reason:
                "Moon data is unavailable."

        };

    }


    const moonHouse =
        moon.house;


    const planetsAroundMoon =
        planetsData.filter(
            planet => {

                if (
                    planet.planet === "Moon" ||
                    planet.planet === "Rahu" ||
                    planet.planet === "Ketu"
                ) {

                    return false;

                }


                const distance =
                    houseDistance(
                        moonHouse,
                        planet.house
                    );


                return (
                    distance === 2 ||
                    distance === 12
                );

            }
        );


    const hasPlanetAroundMoon =
        planetsAroundMoon.length > 0;


    const present =
        !hasPlanetAroundMoon;


    return {

        present,

        cancelled: false,

        moonHouse,

        planetsAroundMoon:
            planetsAroundMoon.map(
                p => p.planet
            ),

        reason:
            present

                ? "No qualifying classical planet is present in the 2nd or 12th house from Moon."

                : "A qualifying classical planet is present in the 2nd or 12th house from Moon."

    };

}


// =====================================================
// PITRU / PITRA DOSHA
// =====================================================
//
// This is one of the areas where traditions differ.
//
// We implement a conservative/common computational
// indicator rather than claiming every traditional
// Pitru Dosha definition.
//
// Current checks:
//
// 1. Sun conjunct Rahu
// 2. Sun conjunct Ketu
// 3. Rahu/Ketu influencing the 9th house
//
// Later we can expand this using 9th lord,
// Sun dignity, aspects, etc.
// =====================================================

function calculatePitru(
    kundali,
    planetsData
) {

    const sun =
        getPlanet(
            planetsData,
            "Sun"
        );

    const rahu =
        getPlanet(
            planetsData,
            "Rahu"
        );

    const ketu =
        getPlanet(
            planetsData,
            "Ketu"
        );


    if (
        !sun ||
        !rahu ||
        !ketu
    ) {

        return {

            present: false,

            reason:
                "Required planetary data is unavailable."

        };

    }


    const sunRahu =
        sun.house === rahu.house;


    const sunKetu =
        sun.house === ketu.house;


    const rahuIn9th =
        rahu.house === 9;


    const ketuIn9th =
        ketu.house === 9;


    const present =
        sunRahu ||
        sunKetu ||
        rahuIn9th ||
        ketuIn9th;


    return {

        present,

        indicators: {

            sunRahu,

            sunKetu,

            rahuIn9th,

            ketuIn9th

        },

        reason:
            present

                ? "One or more commonly used Pitru Dosha indicators are present."

                : "The implemented Pitru Dosha indicators are not present."

    };

}


// =====================================================
// MASTER DOSHA CALCULATION
// =====================================================

function calculateDoshas(
    kundali,
    planetsData
) {

    const manglik =
        calculateManglik(
            kundali,
            planetsData
        );


    const kaalSarp =
        calculateKaalSarp(
            kundali,
            planetsData
        );


    const guruChandal =
        calculateGuruChandal(
            kundali,
            planetsData
        );


    const grahan =
        calculateGrahan(
            kundali,
            planetsData
        );


    const shrapit =
        calculateShrapit(
            kundali,
            planetsData
        );


    const pitru =
        calculatePitru(
            kundali,
            planetsData
        );


    const kemadruma =
        calculateKemadruma(
            kundali,
            planetsData
        );


    const doshas = {

        manglik,

        kaalSarp,

        guruChandal,

        grahan,

        shrapit,

        pitru,

        kemadruma

    };


    const detected =
        Object.entries(doshas)
            .filter(
                ([, value]) =>
                    value.present === true
            )
            .map(
                ([name]) => name
            );


    return {

        doshas,

        summary: {

            totalDetected:
                detected.length,

            detected

        }

    };

}


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    calculateDoshas

};