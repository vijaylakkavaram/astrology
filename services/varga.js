/* =========================================================
   VARGA.JS
   ---------------------------------------------------------
   Parashari-style Shodashavarga calculations

   Supported:
   D1, D2, D3, D4, D7, D9, D10, D12,
   D16, D20, D24, D27, D30, D40, D45, D60

   Input:
       Planet longitude in degrees [0 - 360)

   Output:
       Varga Rashi
       Rashi index
       Division/part
       Degree inside Varga

   IMPORTANT:
   Varga traditions can differ between software/schools.
   This implementation follows commonly used
   Parashari conventions.
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
   SIGN TYPES
   ---------------------------------------------------------
   Movable:
   Mesha, Karka, Tula, Makara

   Fixed:
   Vrishabha, Simha, Vrishchika, Kumbha

   Dual:
   Mithuna, Kanya, Dhanu, Meena
   ========================================================= */

const MOVABLE_SIGNS = [0, 3, 6, 9];

const FIXED_SIGNS = [1, 4, 7, 10];

const DUAL_SIGNS = [2, 5, 8, 11];


/* =========================================================
   HELPERS
   ========================================================= */


/**
 * Normalize longitude to 0 <= longitude < 360
 */
function normalize(degree) {

    degree = Number(degree);

    if (!Number.isFinite(degree)) {
        throw new Error("Invalid longitude: " + degree);
    }

    degree = degree % 360;

    if (degree < 0) {
        degree += 360;
    }

    return degree;
}


/**
 * Get Rashi index from longitude
 *
 * 0  - 30   Mesha
 * 30 - 60   Vrishabha
 * ...
 * 330 - 360 Meena
 */
function getRashiIndex(longitude) {

    longitude = normalize(longitude);

    return Math.floor(longitude / 30);
}


/**
 * Get degree inside current Rashi
 */
function getDegreeInSign(longitude) {

    longitude = normalize(longitude);

    return longitude % 30;
}


/**
 * Get sign type
 */
function getSignType(signIndex) {

    if (MOVABLE_SIGNS.includes(signIndex)) {
        return "movable";
    }

    if (FIXED_SIGNS.includes(signIndex)) {
        return "fixed";
    }

    return "dual";
}


/**
 * Convert sign index to Rashi name
 */
function getRashi(signIndex) {

    return RASHIS[signIndex % 12];
}


/**
 * Return common result structure
 */
function createResult({
    chart,
    longitude,
    signIndex,
    targetIndex,
    part,
    divisions,
    degreeInVarga,
    extra = {}
}) {

    return {

        chart,

        originalLongitude:
            Number(normalize(longitude).toFixed(6)),

        originalRashi:
            getRashi(signIndex),

        originalRashiIndex:
            signIndex,

        rashi:
            getRashi(targetIndex),

        rashiIndex:
            targetIndex,

        part,

        division:
            divisions,

        degreeInVarga:
            Number(degreeInVarga.toFixed(6)),

        ...extra
    };
}


/**
 * Generic equal division helper
 *
 * This helper ONLY performs the mathematical
 * subdivision.
 *
 * The actual Varga-specific starting sign is
 * supplied by startSignIndex.
 */
function calculateEqualVarga(
    longitude,
    divisions,
    startSignIndex,
    chart
) {

    longitude =
        normalize(longitude);

    const signIndex =
        getRashiIndex(longitude);

    const degreeInSign =
        getDegreeInSign(longitude);

    const partSize =
        30 / divisions;

    let part =
        Math.floor(
            degreeInSign / partSize
        );

    if (part >= divisions) {
        part = divisions - 1;
    }

    const remainder =
        degreeInSign -
        (part * partSize);

    const degreeInVarga =
        (remainder / partSize) * 30;

    const targetIndex =
        (startSignIndex + part) % 12;

    return createResult({

        chart,

        longitude,

        signIndex,

        targetIndex,

        part:
            part + 1,

        divisions,

        degreeInVarga
    });
}


/* =========================================================
   D1 - RASHI
   ========================================================= */

function calculateD1(longitude) {

    longitude =
        normalize(longitude);

    const signIndex =
        getRashiIndex(longitude);

    const degreeInSign =
        getDegreeInSign(longitude);

    return {

        chart: "D1",

        originalLongitude:
            Number(longitude.toFixed(6)),

        rashi:
            getRashi(signIndex),

        rashiIndex:
            signIndex,

        degree:
            Number(degreeInSign.toFixed(6))
    };
}


/* =========================================================
   D2 - HORA
   ---------------------------------------------------------
   Each sign = 2 x 15 degrees

   Odd signs:
       0-15  -> Leo
       15-30 -> Cancer

   Even signs:
       0-15  -> Cancer
       15-30 -> Leo
   ========================================================= */

function calculateD2(longitude) {

    longitude =
        normalize(longitude);

    const signIndex =
        getRashiIndex(longitude);

    const degreeInSign =
        getDegreeInSign(longitude);

    const part =
        degreeInSign < 15
            ? 1
            : 2;

    const isOdd =
        (signIndex + 1) % 2 === 1;

    let targetIndex;

    if (isOdd) {

        targetIndex =
            part === 1
                ? 4       // Leo
                : 3;      // Cancer

    } else {

        targetIndex =
            part === 1
                ? 3       // Cancer
                : 4;      // Leo
    }

    const remainder =
        degreeInSign % 15;

    const degreeInHora =
        (remainder / 15) * 30;

    return createResult({

        chart: "D2",

        longitude,

        signIndex,

        targetIndex,

        part,

        divisions: 2,

        degreeInVarga:
            degreeInHora
    });
}


/* =========================================================
   D3 - DREKKANA
   ---------------------------------------------------------
   0-10   -> same sign
   10-20  -> 5th from sign
   20-30  -> 9th from sign
   ========================================================= */

function calculateD3(longitude) {

    longitude =
        normalize(longitude);

    const signIndex =
        getRashiIndex(longitude);

    const degreeInSign =
        getDegreeInSign(longitude);

    const part =
        Math.floor(
            degreeInSign / 10
        );

    const targets = [

        signIndex,

        (signIndex + 4) % 12,

        (signIndex + 8) % 12

    ];

    const targetIndex =
        targets[part];

    const remainder =
        degreeInSign % 10;

    const degreeInVarga =
        (remainder / 10) * 30;

    return createResult({

        chart: "D3",

        longitude,

        signIndex,

        targetIndex,

        part:
            part + 1,

        divisions: 3,

        degreeInVarga
    });
}


/* =========================================================
   D4 - CHATURTHAMSA
   ---------------------------------------------------------
   1st -> same sign
   2nd -> 4th from sign
   3rd -> 7th from sign
   4th -> 10th from sign
   ========================================================= */

function calculateD4(longitude) {

    longitude =
        normalize(longitude);

    const signIndex =
        getRashiIndex(longitude);

    const degreeInSign =
        getDegreeInSign(longitude);

    const partSize =
        30 / 4;

    const part =
        Math.floor(
            degreeInSign / partSize
        );

    const offsets = [
        0,
        3,
        6,
        9
    ];

    const targetIndex =
        (signIndex + offsets[part]) % 12;

    const remainder =
        degreeInSign % partSize;

    const degreeInVarga =
        (remainder / partSize) * 30;

    return createResult({

        chart: "D4",

        longitude,

        signIndex,

        targetIndex,

        part:
            part + 1,

        divisions: 4,

        degreeInVarga
    });
}


/* =========================================================
   D7 - SAPTAMSA
   ---------------------------------------------------------
   Odd signs:
       starts from same sign

   Even signs:
       starts from 7th sign

   Then proceeds sequentially.
   ========================================================= */

function calculateD7(longitude) {

    longitude =
        normalize(longitude);

    const signIndex =
        getRashiIndex(longitude);

    const degreeInSign =
        getDegreeInSign(longitude);

    const divisions = 7;

    const partSize =
        30 / divisions;

    const part =
        Math.floor(
            degreeInSign / partSize
        );

    const isOdd =
        (signIndex + 1) % 2 === 1;

    const startIndex =
        isOdd
            ? signIndex
            : (signIndex + 6) % 12;

    const targetIndex =
        (startIndex + part) % 12;

    const remainder =
        degreeInSign % partSize;

    const degreeInVarga =
        (remainder / partSize) * 30;

    return createResult({

        chart: "D7",

        longitude,

        signIndex,

        targetIndex,

        part:
            part + 1,

        divisions,

        degreeInVarga
    });
}


/* =========================================================
   D9 - NAVAMSA
   ---------------------------------------------------------
   Movable -> starts same sign
   Fixed   -> starts 9th from sign
   Dual    -> starts 5th from sign

   Each Navamsa = 3°20'
   ========================================================= */

function calculateD9(longitude) {

    longitude =
        normalize(longitude);

    const signIndex =
        getRashiIndex(longitude);

    const degreeInSign =
        getDegreeInSign(longitude);

    const divisions = 9;

    const partSize =
        30 / divisions;

    const part =
        Math.floor(
            degreeInSign / partSize
        );

    let startIndex;

    const signType =
        getSignType(signIndex);

    if (signType === "movable") {

        startIndex =
            signIndex;

    } else if (signType === "fixed") {

        startIndex =
            (signIndex + 8) % 12;

    } else {

        startIndex =
            (signIndex + 4) % 12;
    }

    const targetIndex =
        (startIndex + part) % 12;

    const remainder =
        degreeInSign % partSize;

    const degreeInVarga =
        (remainder / partSize) * 30;

    return createResult({

        chart: "D9",

        longitude,

        signIndex,

        targetIndex,

        part:
            part + 1,

        divisions,

        degreeInVarga,

        extra: {

            navamsaNumber:
                part + 1
        }
    });
}


/* =========================================================
   D10 - DASAMSA
   ---------------------------------------------------------
   Odd signs:
       starts from same sign

   Even signs:
       starts from 9th sign

   Each part = 3 degrees
   ========================================================= */

function calculateD10(longitude) {

    longitude =
        normalize(longitude);

    const signIndex =
        getRashiIndex(longitude);

    const degreeInSign =
        getDegreeInSign(longitude);

    const divisions = 10;

    const partSize =
        30 / divisions;

    const part =
        Math.floor(
            degreeInSign / partSize
        );

    const isOdd =
        (signIndex + 1) % 2 === 1;

    const startIndex =
        isOdd
            ? signIndex
            : (signIndex + 8) % 12;

    const targetIndex =
        (startIndex + part) % 12;

    const remainder =
        degreeInSign % partSize;

    const degreeInVarga =
        (remainder / partSize) * 30;

    return createResult({

        chart: "D10",

        longitude,

        signIndex,

        targetIndex,

        part:
            part + 1,

        divisions,

        degreeInVarga
    });
}


/* =========================================================
   D12 - DWADASHAMSA
   ---------------------------------------------------------
   Starts from the original sign and proceeds forward.
   ========================================================= */

function calculateD12(longitude) {

    return calculateEqualVarga(

        longitude,

        12,

        getRashiIndex(longitude),

        "D12"
    );
}


/* =========================================================
   D16 - SHODASHAMSA
   ---------------------------------------------------------
   Movable -> same sign
   Fixed   -> 5th from sign
   Dual    -> 9th from sign
   ========================================================= */

function calculateD16(longitude) {

    longitude =
        normalize(longitude);

    const signIndex =
        getRashiIndex(longitude);

    const signType =
        getSignType(signIndex);

    let startIndex;

    if (signType === "movable") {

        startIndex =
            signIndex;

    } else if (signType === "fixed") {

        startIndex =
            (signIndex + 4) % 12;

    } else {

        startIndex =
            (signIndex + 8) % 12;
    }

    return calculateEqualVarga(

        longitude,

        16,

        startIndex,

        "D16"
    );
}


/* =========================================================
   D20 - VIMSHAMSA
   ---------------------------------------------------------
   Movable -> Aries
   Fixed   -> Sagittarius
   Dual    -> Leo

   This is equivalent to:
   Movable -> same sign
   Fixed   -> 9th from sign
   Dual    -> 5th from sign
   ========================================================= */

function calculateD20(longitude) {

    longitude =
        normalize(longitude);

    const signIndex =
        getRashiIndex(longitude);

    const signType =
        getSignType(signIndex);

    let startIndex;

    if (signType === "movable") {

        startIndex =
            0;       // Aries

    } else if (signType === "fixed") {

        startIndex =
            8;       // Sagittarius

    } else {

        startIndex =
            4;       // Leo
    }

    return calculateEqualVarga(

        longitude,

        20,

        startIndex,

        "D20"
    );
}


/* =========================================================
   D24 - CHATURVIMSHAMSA / SIDDHAMSA
   ---------------------------------------------------------
   Odd signs  -> starts from Leo
   Even signs -> starts from Cancer
   ========================================================= */

function calculateD24(longitude) {

    longitude =
        normalize(longitude);

    const signIndex =
        getRashiIndex(longitude);

    const isOdd =
        (signIndex + 1) % 2 === 1;

    const startIndex =
        isOdd
            ? 4       // Leo
            : 3;      // Cancer

    return calculateEqualVarga(

        longitude,

        24,

        startIndex,

        "D24"
    );
}


/* =========================================================
   D27 - BHAMSA / SAPTAVIMSHAMSA
   ---------------------------------------------------------
   Fire signs  -> Aries
   Earth signs -> Cancer
   Air signs   -> Libra
   Water signs -> Capricorn
   ========================================================= */

function calculateD27(longitude) {

    longitude =
        normalize(longitude);

    const signIndex =
        getRashiIndex(longitude);

    let startIndex;

    /*
       Fire:
       Aries, Leo, Sagittarius
    */

    if (
        [0, 4, 8].includes(signIndex)
    ) {

        startIndex =
            0;       // Aries

    }

    /*
       Earth:
       Taurus, Virgo, Capricorn
    */

    else if (
        [1, 5, 9].includes(signIndex)
    ) {

        startIndex =
            3;       // Cancer

    }

    /*
       Air:
       Gemini, Libra, Aquarius
    */

    else if (
        [2, 6, 10].includes(signIndex)
    ) {

        startIndex =
            6;       // Libra

    }

    /*
       Water:
       Cancer, Scorpio, Pisces
    */

    else {

        startIndex =
            9;       // Capricorn
    }

    return calculateEqualVarga(

        longitude,

        27,

        startIndex,

        "D27"
    );
}


/* =========================================================
   D30 - TRIMSHAMSA
   ---------------------------------------------------------
   SPECIAL NON-EQUAL DIVISION

   Odd signs:
       0-5   Mars
       5-10  Saturn
       10-18 Jupiter
       18-25 Mercury
       25-30 Venus

   Even signs:
       0-5   Venus
       5-12  Mercury
       12-20 Jupiter
       20-25 Saturn
       25-30 Mars

   Classical sign mapping:

   Odd:
       Mars    -> Aries
       Saturn  -> Aquarius
       Jupiter -> Sagittarius
       Mercury -> Gemini
       Venus   -> Libra

   Even:
       Venus   -> Taurus/Libra scheme represented
       Mercury -> Virgo
       Jupiter -> Sagittarius
       Saturn  -> Aquarius
       Mars    -> Aries

   ========================================================= */

function calculateD30(longitude) {

    longitude =
        normalize(longitude);

    const signIndex =
        getRashiIndex(longitude);

    const degreeInSign =
        getDegreeInSign(longitude);

    const isOdd =
        (signIndex + 1) % 2 === 1;

    let part;

    let targetIndex;

    let d30Lord;

    let startDegree;

    let endDegree;


    if (isOdd) {

        /*
         * 0 - 5 Mars
         */

        if (degreeInSign < 5) {

            part = 1;

            targetIndex = 0;

            d30Lord = "Mars";

            startDegree = 0;

            endDegree = 5;
        }

        /*
         * 5 - 10 Saturn
         */

        else if (degreeInSign < 10) {

            part = 2;

            targetIndex = 10;

            d30Lord = "Saturn";

            startDegree = 5;

            endDegree = 10;
        }

        /*
         * 10 - 18 Jupiter
         */

        else if (degreeInSign < 18) {

            part = 3;

            targetIndex = 8;

            d30Lord = "Jupiter";

            startDegree = 10;

            endDegree = 18;
        }

        /*
         * 18 - 25 Mercury
         */

        else if (degreeInSign < 25) {

            part = 4;

            targetIndex = 2;

            d30Lord = "Mercury";

            startDegree = 18;

            endDegree = 25;
        }

        /*
         * 25 - 30 Venus
         */

        else {

            part = 5;

            targetIndex = 6;

            d30Lord = "Venus";

            startDegree = 25;

            endDegree = 30;
        }

    }

    else {

        /*
         * 0 - 5 Venus
         */

        if (degreeInSign < 5) {

            part = 1;

            targetIndex = 6;

            d30Lord = "Venus";

            startDegree = 0;

            endDegree = 5;
        }

        /*
         * 5 - 12 Mercury
         */

        else if (degreeInSign < 12) {

            part = 2;

            targetIndex = 2;

            d30Lord = "Mercury";

            startDegree = 5;

            endDegree = 12;
        }

        /*
         * 12 - 20 Jupiter
         */

        else if (degreeInSign < 20) {

            part = 3;

            targetIndex = 8;

            d30Lord = "Jupiter";

            startDegree = 12;

            endDegree = 20;
        }

        /*
         * 20 - 25 Saturn
         */

        else if (degreeInSign < 25) {

            part = 4;

            targetIndex = 10;

            d30Lord = "Saturn";

            startDegree = 20;

            endDegree = 25;
        }

        /*
         * 25 - 30 Mars
         */

        else {

            part = 5;

            targetIndex = 0;

            d30Lord = "Mars";

            startDegree = 25;

            endDegree = 30;
        }
    }


    /*
     * Calculate degree inside D30 segment.
     *
     * D30 uses unequal segment sizes,
     * therefore calculate using actual
     * segment width.
     */

    const segmentSize =
        endDegree - startDegree;

    const remainder =
        degreeInSign - startDegree;

    const degreeInVarga =
        (remainder / segmentSize) * 30;


    return createResult({

        chart: "D30",

        longitude,

        signIndex,

        targetIndex,

        part,

        divisions: 30,

        degreeInVarga,

        extra: {

            d30Lord
        }
    });
}


/* =========================================================
   D40 - KHAVEDAMSA
   ---------------------------------------------------------
   Odd signs  -> starts from Aries
   Even signs -> starts from Libra
   ========================================================= */

function calculateD40(longitude) {

    longitude =
        normalize(longitude);

    const signIndex =
        getRashiIndex(longitude);

    const isOdd =
        (signIndex + 1) % 2 === 1;

    const startIndex =
        isOdd
            ? 0       // Aries
            : 6;      // Libra

    return calculateEqualVarga(

        longitude,

        40,

        startIndex,

        "D40"
    );
}


/* =========================================================
   D45 - AKSHAVEDAMSA
   ---------------------------------------------------------
   Movable -> Aries
   Fixed   -> Leo
   Dual    -> Sagittarius
   ========================================================= */

function calculateD45(longitude) {

    longitude =
        normalize(longitude);

    const signIndex =
        getRashiIndex(longitude);

    const signType =
        getSignType(signIndex);

    let startIndex;

    if (signType === "movable") {

        startIndex =
            0;       // Aries

    } else if (signType === "fixed") {

        startIndex =
            4;       // Leo

    } else {

        startIndex =
            8;       // Sagittarius
    }

    return calculateEqualVarga(

        longitude,

        45,

        startIndex,

        "D45"
    );
}


/* =========================================================
   D60 - SHASHTIAMSA
   ---------------------------------------------------------
   Each sign = 60 parts of 0°30'

   Sequential progression from the original sign.
   ========================================================= */

function calculateD60(longitude) {

    longitude =
        normalize(longitude);

    const signIndex =
        getRashiIndex(longitude);

    return calculateEqualVarga(

        longitude,

        60,

        signIndex,

        "D60"
    );
}


/* =========================================================
   CALCULATE ALL VARGAS FOR ONE PLANET
   ========================================================= */

function calculatePlanetVargas(longitude) {

    return {

        D1:
            calculateD1(longitude),

        D2:
            calculateD2(longitude),

        D3:
            calculateD3(longitude),

        D4:
            calculateD4(longitude),

        D7:
            calculateD7(longitude),

        D9:
            calculateD9(longitude),

        D10:
            calculateD10(longitude),

        D12:
            calculateD12(longitude),

        D16:
            calculateD16(longitude),

        D20:
            calculateD20(longitude),

        D24:
            calculateD24(longitude),

        D27:
            calculateD27(longitude),

        D30:
            calculateD30(longitude),

        D40:
            calculateD40(longitude),

        D45:
            calculateD45(longitude),

        D60:
            calculateD60(longitude)
    };
}


/* =========================================================
   CALCULATE VARGAS FOR ENTIRE KUNDALI
   ========================================================= */

function calculateVargas(kundali) {

    const result = {};


    for (
        const planet in kundali
    ) {

        if (
            !kundali[planet]
        ) {

            continue;
        }


        /*
         * Every planet/Lagna must have longitude.
         */

        if (
            kundali[planet].longitude === undefined
        ) {

            continue;
        }


        result[planet] =
            calculatePlanetVargas(
                kundali[planet].longitude
            );
    }


    return result;
}


/* =========================================================
   OPTIONAL:
   CREATE VARGA HOUSE INFORMATION
   ---------------------------------------------------------
   This is useful for your prediction engine.

   Example:

   D9 Lagna = Taurus

   Planet = Leo

   Taurus -> 1
   Gemini -> 2
   Cancer -> 3
   Leo    -> 4

   Therefore planet is in 4th house of D9.
   ========================================================= */

function getVargaHouse(
    lagnaRashiIndex,
    planetRashiIndex
) {

    return (
        (planetRashiIndex - lagnaRashiIndex + 12)
        % 12
    ) + 1;
}


/**
 * Add house information to a Varga chart.
 *
 * This does NOT replace Bhava Chalit.
 * It simply gives whole-sign Varga houses.
 */
function addVargaHouses(
    vargaData
) {

    if (
        !vargaData ||
        !vargaData.Lagna
    ) {

        return vargaData;
    }


    const result =
        JSON.parse(
            JSON.stringify(vargaData)
        );


    const charts = [
        "D1",
        "D2",
        "D3",
        "D4",
        "D7",
        "D9",
        "D10",
        "D12",
        "D16",
        "D20",
        "D24",
        "D27",
        "D30",
        "D40",
        "D45",
        "D60"
    ];


    for (
        const chart of charts
    ) {

        if (
            !result.Lagna ||
            !result.Lagna[chart]
        ) {

            continue;
        }


        const lagnaIndex =
            result.Lagna[chart].rashiIndex;


        for (
            const planet in result
        ) {

            if (
                !result[planet] ||
                !result[planet][chart]
            ) {

                continue;
            }


            result[planet][chart].house =
                getVargaHouse(

                    lagnaIndex,

                    result[planet][chart]
                        .rashiIndex
                );
        }
    }


    return result;
}


/* =========================================================
   FINAL EXPORT
   ========================================================= */

module.exports = {

    calculateVargas,

    calculatePlanetVargas,

    getVargaHouse,

    addVargaHouses

};