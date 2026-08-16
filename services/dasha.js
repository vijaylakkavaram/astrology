const DASHAS = [
    { name: "Ketu", years: 7 },
    { name: "Venus", years: 20 },
    { name: "Sun", years: 6 },
    { name: "Moon", years: 10 },
    { name: "Mars", years: 7 },
    { name: "Rahu", years: 18 },
    { name: "Jupiter", years: 16 },
    { name: "Saturn", years: 19 },
    { name: "Mercury", years: 17 }
];

const NAKSHATRA_LORDS = [
    "Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury",
    "Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury",
    "Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"
];

const NAKSHATRA_SIZE = 13 + (20 / 60); // 13.333333°
function calculate(moonLongitude, birthDate) {

    moonLongitude = ((moonLongitude % 360) + 360) % 360;

    const nakshatraIndex = Math.floor(
        moonLongitude / NAKSHATRA_SIZE
    );

    const lord = NAKSHATRA_LORDS[nakshatraIndex];

    const dashaIndex = DASHAS.findIndex(
        d => d.name === lord
    );

    const startDegree =
        nakshatraIndex * NAKSHATRA_SIZE;

    const traversed =
        moonLongitude - startDegree;

    const remainingFraction =
        (NAKSHATRA_SIZE - traversed) /
        NAKSHATRA_SIZE;

    const totalYears =
        DASHAS[dashaIndex].years;

    const balanceYears =
        totalYears * remainingFraction;

    const birth = new Date(birthDate);

    /*
     * ------------------------------------------------
     * Helper: Add years to date
     * ------------------------------------------------
     */
    function addYears(date, years) {

        const result = new Date(date);

        result.setDate(
            result.getDate() +
            Math.round(years * 365.25)
        );

        return result;
    }

    /*
     * ------------------------------------------------
     * Helper: Format date
     * ------------------------------------------------
     */
    function formatDate(date) {

        return date
            .toISOString()
            .substring(0, 10);
    }

    /*
     * ------------------------------------------------
     * Calculate all Bhukthis for a Mahadasha
     *
     * Bhukthi duration:
     *
     * MD years × Bhukthi lord years / 120
     * ------------------------------------------------
     */
    function calculateBhukthis(
        mahadashaIndex,
        startDate,
        endDate = null,
        startBhukthiIndex = 0,
        elapsedBhukthiFraction = 0
    ) {

        const mahadashaYears =
            DASHAS[mahadashaIndex].years;

        const bhukthis = [];

        let bhukthiIndex =
            startBhukthiIndex;

        let currentDate =
            new Date(startDate);

        /*
         * If this is the birth Mahadasha,
         * some portion of the first Bhukthis
         * may already have elapsed before birth.
         *
         * So the first Bhukthi starts at birth
         * with the remaining portion.
         */
        for (let i = 0; i < 9; i++) {

            const bhukthiLord =
                DASHAS[bhukthiIndex];

            const fullBhukthiYears =
                (
                    mahadashaYears *
                    bhukthiLord.years
                ) / 120;

            let bhukthiYears =
                fullBhukthiYears;

            /*
             * For birth Mahadasha, adjust the
             * first Bhukthi based on elapsed portion.
             */
            if (
                i === 0 &&
                elapsedBhukthiFraction > 0
            ) {

                bhukthiYears =
                    fullBhukthiYears *
                    (1 - elapsedBhukthiFraction);
            }

            const bhukthiEnd =
                addYears(
                    currentDate,
                    bhukthiYears
                );

            /*
             * Don't go beyond Mahadasha end.
             */
            let actualEnd =
                new Date(bhukthiEnd);

            if (
                endDate &&
                actualEnd > endDate
            ) {
                actualEnd =
                    new Date(endDate);
            }

            bhukthis.push({

                bhukthi:
                    bhukthiLord.name,

                from:
                    formatDate(currentDate),

                to:
                    formatDate(actualEnd),

                years:
                    Number(
                        bhukthiYears.toFixed(4)
                    )

            });

            currentDate =
                actualEnd;

            bhukthiIndex =
                (bhukthiIndex + 1) % 9;

            /*
             * Stop if Mahadasha has ended.
             */
            if (
                endDate &&
                currentDate >= endDate
            ) {
                break;
            }
        }

        return bhukthis;
    }

    /*
     * ------------------------------------------------
     * Calculate birth Mahadasha end
     * ------------------------------------------------
     */

    const endDate =
        addYears(
            birth,
            balanceYears
        );

    /*
     * ------------------------------------------------
     * Find current Bhukthi at birth
     *
     * The Bhukthi sequence starts with the
     * Mahadasha lord.
     *
     * elapsed MD portion =
     * 1 - remainingFraction
     * ------------------------------------------------
     */

    const elapsedFraction =
        1 - remainingFraction;

    let accumulatedFraction = 0;

    let birthBhukthiIndex =
        dashaIndex;

    let birthBhukthiElapsedFraction = 0;

    for (let i = 0; i < 9; i++) {

        const bhukthiIndex =
            (dashaIndex + i) % 9;

        const bhukthiYears =
            (
                totalYears *
                DASHAS[bhukthiIndex].years
            ) / 120;

        const bhukthiFraction =
            bhukthiYears / totalYears;

        if (
            elapsedFraction >=
            accumulatedFraction +
            bhukthiFraction
        ) {

            accumulatedFraction +=
                bhukthiFraction;

            continue;
        }

        birthBhukthiIndex =
            bhukthiIndex;

        birthBhukthiElapsedFraction =
            (
                elapsedFraction -
                accumulatedFraction
            ) / bhukthiFraction;

        break;
    }

    /*
     * ------------------------------------------------
     * Birth Mahadasha Bhukthis
     * ------------------------------------------------
     */

    const birthBhukthis =
        calculateBhukthis(
            dashaIndex,
            birth,
            endDate,
            birthBhukthiIndex,
            birthBhukthiElapsedFraction
        );

    /*
     * ------------------------------------------------
     * Mahadasha timeline
     * ------------------------------------------------
     */

    let timeline = [];

    /*
     * Birth Mahadasha
     */
    timeline.push({

        dasha:
            DASHAS[dashaIndex].name,

        from:
            formatDate(birth),

        to:
            formatDate(endDate),

        years:
            Number(
                balanceYears.toFixed(2)
            ),

        bhukthis:
            birthBhukthis

    });

    /*
     * Next Mahadashas
     */
    let currentDate =
        new Date(endDate);

    let index =
        (dashaIndex + 1) % 9;

    /*
     * Add 8 future Mahadashas
     */
    for (let i = 0; i < 8; i++) {

        const start =
            new Date(currentDate);

        const mahadashaYears =
            DASHAS[index].years;

        const end =
            addYears(
                start,
                mahadashaYears
            );

        /*
         * Full Bhukthi sequence for
         * this Mahadasha.
         *
         * Bhukthi always starts from
         * the Mahadasha lord.
         */
        const bhukthis =
            calculateBhukthis(
                index,
                start,
                end,
                index,
                0
            );

        timeline.push({

            dasha:
                DASHAS[index].name,

            from:
                formatDate(start),

            to:
                formatDate(end),

            years:
                mahadashaYears,

            bhukthis

        });

        currentDate =
            new Date(end);

        index =
            (index + 1) % 9;
    }

    return {

        birthMahadasha:
            lord,

        balanceYears:
            Number(
                balanceYears.toFixed(2)
            ),

        balanceEnds:
            formatDate(endDate),

        birthBhukthi:
            DASHAS[birthBhukthiIndex].name,

        timeline

    };
}


module.exports = {
    calculate
};