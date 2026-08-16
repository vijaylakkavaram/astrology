/* =========================================================
   YOGA.JS
   Yoga detection from existing Kundali data
   ========================================================= */

const RASHIS = [
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


/* =========================================================
   HELPERS
   ========================================================= */

function getSignIndex(
    planet
) {

    if (
        !planet ||
        !planet.rashi
    ) {

        return -1;

    }


    return RASHIS.indexOf(
        planet.rashi
    );

}


function getHouse(
    planet,
    lagna
) {

    const planetSign =
        getSignIndex(
            planet
        );


    const lagnaSign =
        getSignIndex(
            lagna
        );


    if (
        planetSign < 0 ||
        lagnaSign < 0
    ) {

        return null;

    }


    let house =
        planetSign -
        lagnaSign +
        1;


    if (house <= 0) {

        house += 12;

    }


    return house;

}


function isKendra(
    house
) {

    return [
        1,
        4,
        7,
        10
    ].includes(house);

}


function isTrikona(
    house
) {

    return [
        1,
        5,
        9
    ].includes(house);

}


/* =========================================================
   YOGA RESULT
   ========================================================= */

function yoga(
    name,
    description,
    planets,
    type
) {

    return {

        name,

        type,

        planets,

        description

    };

}


/* =========================================================
   GAJA KESARI YOGA
   ========================================================= */

function checkGajaKesari(
    kundali
) {

    const moon =
        kundali.Moon;


    const jupiter =
        kundali.Jupiter;


    if (
        !moon ||
        !jupiter
    ) {

        return null;

    }


    const moonSign =
        getSignIndex(
            moon
        );


    const jupiterSign =
        getSignIndex(
            jupiter
        );


    if (
        moonSign < 0 ||
        jupiterSign < 0
    ) {

        return null;

    }


    let distance =
        jupiterSign -
        moonSign;


    if (distance < 0) {

        distance += 12;

    }


    const house =
        distance + 1;


    if (
        [
            1,
            4,
            7,
            10
        ].includes(house)
    ) {

        return yoga(

            "Gaja Kesari Yoga",

            "Jupiter is in a Kendra from Moon.",

            [
                "Moon",
                "Jupiter"
            ],

            "Raja Yoga"

        );

    }


    return null;

}


/* =========================================================
   BUDHA ADITYA YOGA
   ========================================================= */

function checkBudhaAditya(
    kundali
) {

    const sun =
        kundali.Sun;


    const mercury =
        kundali.Mercury;


    if (
        !sun ||
        !mercury
    ) {

        return null;

    }


    if (
        sun.rashi ===
        mercury.rashi
    ) {

        return yoga(

            "Budha Aditya Yoga",

            "Sun and Mercury are placed together in the same sign.",

            [
                "Sun",
                "Mercury"
            ],

            "Raja Yoga"

        );

    }


    return null;

}


/* =========================================================
   DHANA YOGA
   ========================================================= */

function checkDhanaYoga(
    kundali
) {

    const lagna =
        kundali.Lagna;


    const jupiter =
        kundali.Jupiter;


    const venus =
        kundali.Venus;


    if (
        !lagna ||
        !jupiter ||
        !venus
    ) {

        return null;

    }


    const jupiterHouse =
        getHouse(
            jupiter,
            lagna
        );


    const venusHouse =
        getHouse(
            venus,
            lagna
        );


    const dhanabhava =
        [
            2,
            5,
            9,
            11
        ];


    if (
        dhanabhava.includes(
            jupiterHouse
        ) &&
        dhanabhava.includes(
            venusHouse
        )
    ) {

        return yoga(

            "Dhana Yoga",

            "Benefic planets occupy wealth-related houses.",

            [
                "Jupiter",
                "Venus"
            ],

            "Dhana"

        );

    }


    return null;

}


/* =========================================================
   RAJA YOGA
   ========================================================= */

function checkRajaYoga(
    kundali
) {

    const lagna =
        kundali.Lagna;


    if (!lagna) {

        return null;

    }


    const planets =
        [
            "Sun",
            "Moon",
            "Mars",
            "Mercury",
            "Jupiter",
            "Venus",
            "Saturn"
        ];


    const kendraPlanets = [];


    planets.forEach(
        planetName => {

            const planet =
                kundali[
                    planetName
                ];


            if (!planet) {

                return;

            }


            const house =
                getHouse(
                    planet,
                    lagna
                );


            if (
                isKendra(
                    house
                )
            ) {

                kendraPlanets.push(
                    planetName
                );

            }

        }
    );


    if (
        kendraPlanets.length >= 2
    ) {

        return yoga(

            "Kendra Raja Yoga",

            "Multiple planets occupy Kendra houses.",

            kendraPlanets,

            "Raja Yoga"

        );

    }


    return null;

}


/* =========================================================
   PANCHA MAHAPURUSHA - BASIC CHECK
   ========================================================= */

function checkMahapurusha(
    kundali
) {

    const lagna =
        kundali.Lagna;


    if (!lagna) {

        return [];

    }


    const results = [];


    const candidates = {

        Mars:
            "Ruchaka Yoga",

        Mercury:
            "Bhadra Yoga",

        Jupiter:
            "Hamsa Yoga",

        Venus:
            "Malavya Yoga",

        Saturn:
            "Sasa Yoga"

    };


    Object.entries(
        candidates
    ).forEach(
        ([planetName, yogaName]) => {

            const planet =
                kundali[
                    planetName
                ];


            if (!planet) {

                return;

            }


            const house =
                getHouse(
                    planet,
                    lagna
                );


            if (
                isKendra(
                    house
                )
            ) {

                results.push(

                    yoga(

                        yogaName,

                        `${planetName} is placed in a Kendra.`,

                        [
                            planetName
                        ],

                        "Mahapurusha"

                    )

                );

            }

        }
    );


    return results;

}


/* =========================================================
   MAIN YOGA DETECTION
   ========================================================= */

function detectYogas(
    kundali
) {

    const results = [];


    const checks = [

        checkGajaKesari(
            kundali
        ),

        checkBudhaAditya(
            kundali
        ),

        checkDhanaYoga(
            kundali
        ),

        checkRajaYoga(
            kundali
        )

    ];


    checks.forEach(
        result => {

            if (result) {

                results.push(
                    result
                );

            }

        }
    );


    results.push(
        ...checkMahapurusha(
            kundali
        )
    );


    return results;

}


module.exports = {

    detectYogas

};