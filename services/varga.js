/* =========================================================
   VARGA.JS
   Calculates divisional/Varga chart positions
   from the existing Kundali planet longitudes.

   Supported:
   D1, D2, D3, D4, D7, D9, D10, D12,
   D16, D20, D24, D27, D30, D40, D45, D60
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


function normalize(degree) {

    degree = Number(degree) % 360;

    if (degree < 0) {
        degree += 360;
    }

    return degree;
}


/* =========================================================
   SIGN INDEX
   ========================================================= */

function getRashiIndex(longitude) {

    longitude = normalize(longitude);

    return Math.floor(
        longitude / 30
    );

}


/* =========================================================
   D1
   ========================================================= */

function calculateD1(longitude) {

    const index =
        getRashiIndex(longitude);

    return {

        rashi:
            RASHIS[index],

        rashiIndex:
            index,

        longitude:
            normalize(longitude)

    };

}


/* =========================================================
   D2 - HORA
   ========================================================= */

function calculateD2(longitude) {

    longitude =
        normalize(longitude);

    const rashi =
        getRashiIndex(longitude);

    const degree =
        longitude % 30;


    let result;


    if (degree < 15) {

        /*
         * Odd signs:
         * first half Sun
         * second half Moon
         *
         * Even signs reverse.
         */

        if ((rashi + 1) % 2 === 1) {

            result =
                degree < 15
                    ? 4
                    : 3;

        }
        else {

            result =
                degree < 15
                    ? 3
                    : 4;

        }

    }


    /*
     * Traditional simplified Hora
     */

    const signIndex =
        degree < 15
            ? (
                (rashi + 1) % 2 === 1
                    ? 4
                    : 3
            )
            : (
                (rashi + 1) % 2 === 1
                    ? 3
                    : 4
            );


    return {

        rashi:
            RASHIS[signIndex],

        rashiIndex:
            signIndex,

        longitude:
            normalize(longitude)

    };

}


/* =========================================================
   GENERIC DIVISION
   ========================================================= */

function calculateGenericVarga(
    longitude,
    divisions
) {

    longitude =
        normalize(longitude);


    const signIndex =
        Math.floor(
            longitude / 30
        );


    const degreeInSign =
        longitude % 30;


    const partSize =
        30 / divisions;


    let part =
        Math.floor(
            degreeInSign / partSize
        );


    if (part >= divisions) {
        part = divisions - 1;
    }


    /*
     * Generic progression.

     * This is useful as a structural Varga
     * calculation, but specialized Vargas
     * have their own traditional rules.
     */

    const vargaIndex =
        (
            signIndex * divisions +
            part
        ) % 12;


    const vargaDegree =
        (
            degreeInSign %
            partSize
        ) /
        partSize *
        30;


    return {

        rashi:
            RASHIS[vargaIndex],

        rashiIndex:
            vargaIndex,

        degree:
            Number(
                vargaDegree.toFixed(4)
            ),

        division:
            divisions,

        part:
            part + 1

    };

}


/* =========================================================
   D3
   ========================================================= */

function calculateD3(longitude) {

    const sign =
        getRashiIndex(longitude);

    const degree =
        normalize(longitude) % 30;

    const part =
        Math.floor(
            degree / 10
        );


    /*
     * Traditional Drekkana:
     *
     * 1st = same sign
     * 2nd = 5th from sign
     * 3rd = 9th from sign
     */

    const targets = [

        sign,

        (sign + 4) % 12,

        (sign + 8) % 12

    ];


    const target =
        targets[part];


    return {

        rashi:
            RASHIS[target],

        rashiIndex:
            target,

        part:
            part + 1

    };

}


/* =========================================================
   D9 - NAVAMSA
   ========================================================= */

function calculateD9(longitude) {

    longitude =
        normalize(longitude);


    const sign =
        Math.floor(
            longitude / 30
        );


    const degree =
        longitude % 30;


    const pada =
        Math.floor(
            degree /
            (30 / 9)
        );


    /*
     * Navamsa starts:
     *
     * Movable signs -> same sign
     * Fixed signs   -> 9th from sign
     * Dual signs    -> 5th from sign
     */

    const modality =
        sign % 3;


    let start;


    if (modality === 0) {

        start =
            sign;

    }
    else if (modality === 1) {

        start =
            (sign + 8) % 12;

    }
    else {

        start =
            (sign + 4) % 12;

    }


    const navamsaIndex =
        (start + pada) % 12;


    const degreeInNavamsa =
        (
            degree %
            (30 / 9)
        ) /
        (30 / 9) *
        30;


    return {

        rashi:
            RASHIS[navamsaIndex],

        rashiIndex:
            navamsaIndex,

        navamsaNumber:
            pada + 1,

        degreeInNavamsa:
            Number(
                degreeInNavamsa.toFixed(4)
            )

    };

}


/* =========================================================
   D10
   ========================================================= */

function calculateD10(longitude) {

    const sign =
        getRashiIndex(longitude);

    const degree =
        normalize(longitude) % 30;

    const part =
        Math.floor(
            degree / 3
        );


    /*
     * Simplified D10 progression.
     */

    let target;


    if ((sign + 1) % 2 === 1) {

        target =
            (sign + part) % 12;

    }
    else {

        target =
            (sign + 8 + part) % 12;

    }


    return {

        rashi:
            RASHIS[target],

        rashiIndex:
            target,

        part:
            part + 1

    };

}


/* =========================================================
   D12
   ========================================================= */

function calculateD12(longitude) {

    return calculateGenericVarga(
        longitude,
        12
    );

}


/* =========================================================
   D16
   ========================================================= */

function calculateD16(longitude) {

    return calculateGenericVarga(
        longitude,
        16
    );

}


/* =========================================================
   D20
   ========================================================= */

function calculateD20(longitude) {

    return calculateGenericVarga(
        longitude,
        20
    );

}


/* =========================================================
   D24
   ========================================================= */

function calculateD24(longitude) {

    return calculateGenericVarga(
        longitude,
        24
    );

}


/* =========================================================
   D27
   ========================================================= */

function calculateD27(longitude) {

    return calculateGenericVarga(
        longitude,
        27
    );

}


/* =========================================================
   D30
   ========================================================= */

function calculateD30(longitude) {

    return calculateGenericVarga(
        longitude,
        30
    );

}


/* =========================================================
   D40
   ========================================================= */

function calculateD40(longitude) {

    return calculateGenericVarga(
        longitude,
        40
    );

}


/* =========================================================
   D45
   ========================================================= */

function calculateD45(longitude) {

    return calculateGenericVarga(
        longitude,
        45
    );

}


/* =========================================================
   D60
   ========================================================= */

function calculateD60(longitude) {

    return calculateGenericVarga(
        longitude,
        60
    );

}


/* =========================================================
   CALCULATE ALL VARGAS
   ========================================================= */

function calculatePlanetVargas(
    longitude
) {

    return {

        D1:
            calculateD1(
                longitude
            ),

        D2:
            calculateD2(
                longitude
            ),

        D3:
            calculateD3(
                longitude
            ),

        D4:
            calculateGenericVarga(
                longitude,
                4
            ),

        D7:
            calculateGenericVarga(
                longitude,
                7
            ),

        D9:
            calculateD9(
                longitude
            ),

        D10:
            calculateD10(
                longitude
            ),

        D12:
            calculateD12(
                longitude
            ),

        D16:
            calculateD16(
                longitude
            ),

        D20:
            calculateD20(
                longitude
            ),

        D24:
            calculateD24(
                longitude
            ),

        D27:
            calculateD27(
                longitude
            ),

        D30:
            calculateD30(
                longitude
            ),

        D40:
            calculateD40(
                longitude
            ),

        D45:
            calculateD45(
                longitude
            ),

        D60:
            calculateD60(
                longitude
            )

    };

}


/* =========================================================
   CALCULATE VARGAS FOR ENTIRE KUNDALI
   ========================================================= */

function calculateVargas(
    kundali
) {

    const result = {};


    for (
        const planet in kundali
    ) {

        if (
            planet === "Lagna"
        ) {

            result.Lagna =
                calculatePlanetVargas(
                    kundali.Lagna.longitude
                );

            continue;

        }


        if (
            kundali[planet] &&
            kundali[planet].longitude !== undefined
        ) {

            result[planet] =
                calculatePlanetVargas(
                    kundali[
                        planet
                    ].longitude
                );

        }

    }


    return result;

}


module.exports = {

    calculateVargas,

    calculatePlanetVargas

};