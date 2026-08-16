/* =========================================================
   SHADBALA.JS

   Six-fold planetary strength

   1. Sthana Bala
   2. Dig Bala
   3. Kala Bala
   4. Chesta Bala
   5. Naisargika Bala
   6. Drik Bala

   NOTE:
   This module is structured so your existing
   Swiss Ephemeris Kundali data can be passed into it.
   ========================================================= */


/* =========================================================
   PLANETS
   ========================================================= */

const PLANETS = [
    "Sun",
    "Moon",
    "Mars",
    "Mercury",
    "Jupiter",
    "Venus",
    "Saturn"
];


/* =========================================================
   NATURAL STRENGTH
   ========================================================= */

const NAISARGIKA_BALA = {

    Sun: 60.00,

    Moon: 51.43,

    Mars: 17.14,

    Mercury: 25.71,

    Jupiter: 34.29,

    Venus: 42.86,

    Saturn: 8.57

};


/* =========================================================
   HELPERS
   ========================================================= */

function normalize(degree) {

    degree =
        Number(degree) % 360;

    if (degree < 0) {

        degree += 360;

    }

    return degree;

}


function angularDistance(
    a,
    b
) {

    let distance =
        normalize(a) -
        normalize(b);


    if (distance < 0) {

        distance += 360;

    }


    return distance;

}


/* =========================================================
   NATURAL BALA
   ========================================================= */

function calculateNaisargikaBala(
    planet
) {

    return (
        NAISARGIKA_BALA[
            planet
        ] || 0
    );

}


/* =========================================================
   DIG BALA
   =========================================================

   Simplified directional strength based on house.

   Maximum strength is at the traditional
   Dig Bala direction for the planet.
   ========================================================= */

function calculateDigBala(
    planet,
    house
) {

    if (!house) {

        return 0;

    }


    const digPositions = {

        Sun: 10,

        Mars: 10,

        Jupiter: 1,

        Mercury: 1,

        Moon: 4,

        Venus: 4,

        Saturn: 7

    };


    const strongestHouse =
        digPositions[
            planet
        ];


    if (!strongestHouse) {

        return 0;

    }


    let distance =
        Math.abs(
            house -
            strongestHouse
        );


    if (distance > 6) {

        distance =
            12 - distance;

    }


    /*
     * 0 distance = maximum
     * 6 distance = minimum
     */

    return Number(
        (
            60 -
            (
                distance * 10
            )
        ).toFixed(2)
    );

}


/* =========================================================
   CHESTA BALA
   ========================================================= */

function calculateChestaBala(
    planetData
) {

    if (!planetData) {

        return 0;

    }


    const speed =
        Number(
            planetData.speed || 0
        );


    /*
     * Retrograde planets receive
     * higher motional strength.

     * This is a normalized implementation
     * for application display.
     */

    if (
        planetData.retrograde === true ||
        speed < 0
    ) {

        return 60;

    }


    const absoluteSpeed =
        Math.abs(speed);


    /*
     * Faster motion gives more
     * motional strength.
     */

    const value =
        Math.min(
            60,
            absoluteSpeed * 20
        );


    return Number(
        value.toFixed(2)
    );

}


/* =========================================================
   STHANA BALA
   ========================================================= */

function calculateSthanaBala(
    planetData
) {

    if (!planetData) {

        return 0;

    }


    let score = 0;


    /*
     * Sign-based strength.
     */

    const dignity =
        planetData.dignity;


    if (
        dignity === "exalted"
    ) {

        score += 60;

    }
    else if (
        dignity === "own"
    ) {

        score += 45;

    }
    else if (
        dignity === "friend"
    ) {

        score += 30;

    }
    else if (
        dignity === "neutral"
    ) {

        score += 20;

    }
    else if (
        dignity === "enemy"
    ) {

        score += 10;

    }
    else if (
        dignity === "debilitated"
    ) {

        score += 0;

    }
    else {

        /*
         * We don't invent a dignity
         * when it isn't present.
         */

        score += 0;

    }


    /*
     * House strength.
     */

    const house =
        Number(
            planetData.house
        );


    if (
        [1, 4, 7, 10]
            .includes(house)
    ) {

        score += 20;

    }
    else if (
        [5, 9]
            .includes(house)
    ) {

        score += 15;

    }
    else if (
        [2, 11]
            .includes(house)
    ) {

        score += 10;

    }


    return Number(
        Math.min(
            100,
            score
        ).toFixed(2)
    );

}


/* =========================================================
   KALA BALA
   ========================================================= */

function calculateKalaBala(
    planet,
    birthDate
) {

    /*
     * Full Kala Bala has multiple
     * components.

     * This function currently provides
     * the day/night component while
     * keeping the API ready for the
     * remaining components.
     */

    if (!birthDate) {

        return 0;

    }


    const date =
        new Date(
            birthDate
        );


    const hour =
        date.getUTCHours();


    const isDay =
        hour >= 6 &&
        hour < 18;


    const dayPlanets = [
        "Sun",
        "Jupiter",
        "Venus"
    ];


    const nightPlanets = [
        "Moon",
        "Mars",
        "Saturn"
    ];


    if (
        isDay &&
        dayPlanets.includes(
            planet
        )
    ) {

        return 30;

    }


    if (
        !isDay &&
        nightPlanets.includes(
            planet
        )
    ) {

        return 30;

    }


    return 15;

}


/* =========================================================
   DRIK BALA
   ========================================================= */

function calculateDrikBala(
    planet,
    planets
) {

    if (!planets) {

        return 0;

    }


    const target =
        planets.find(
            p =>
                p.planet ===
                planet
        );


    if (!target) {

        return 0;

    }


    /*
     * Aspect-based contribution.

     * We use the existing planetary
     * positions and determine
     * major opposition/aspect
     * relationships.

     * Positive value = supportive
     * Negative value = challenging
     */

    let score = 0;


    planets.forEach(
        other => {

            if (
                other.planet ===
                planet
            ) {

                return;

            }


            if (
                other.longitude ===
                undefined
            ) {

                return;

            }


            const distance =
                angularDistance(
                    target.longitude,
                    other.longitude
                );


            /*
             * 180 degree opposition.
             */

            const opposition =
                Math.abs(
                    distance -
                    180
                );


            if (
                opposition <= 8
            ) {

                const benefics = [
                    "Jupiter",
                    "Venus",
                    "Mercury",
                    "Moon"
                ];


                if (
                    benefics.includes(
                        other.planet
                    )
                ) {

                    score += 15;

                }
                else {

                    score -= 15;

                }

            }

        }
    );


    return Number(
        Math.max(
            -60,
            Math.min(
                60,
                score
            )
        ).toFixed(2)
    );

}


/* =========================================================
   MAIN SHADBALA
   ========================================================= */

function calculateShadbala(
    kundali,
    planetsData,
    birthDate
) {

    const results = [];


    for (
        const planet
        of PLANETS
    ) {

        const planetData =
            kundali[
                planet
            ];


        const planetHouse =
            planetsData.find(
                p =>
                    p.planet ===
                    planet
            );


        if (!planetData) {

            continue;

        }


        const data = {

            ...planetData,

            house:
                planetHouse
                    ?.house

        };


        const sthanaBala =
            calculateSthanaBala(
                data
            );


        const digBala =
            calculateDigBala(
                planet,
                data.house
            );


        const kalaBala =
            calculateKalaBala(
                planet,
                birthDate
            );


        const chestaBala =
            calculateChestaBala(
                data
            );


        const naisargikaBala =
            calculateNaisargikaBala(
                planet
            );


        const drikBala =
            calculateDrikBala(
                planet,
                planetsData
            );


        const total =
            sthanaBala +
            digBala +
            kalaBala +
            chestaBala +
            naisargikaBala +
            drikBala;


        results.push({

            planet,

            sthanaBala,

            digBala,

            kalaBala,

            chestaBala,

            naisargikaBala,

            drikBala,

            total:
                Number(
                    total.toFixed(2)
                )

        });

    }


    return results;

}


module.exports = {

    calculateShadbala

};
