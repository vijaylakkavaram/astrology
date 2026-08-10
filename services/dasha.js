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

    const nakshatraIndex = Math.floor(moonLongitude / NAKSHATRA_SIZE);

    const lord = NAKSHATRA_LORDS[nakshatraIndex];

    const dashaIndex = DASHAS.findIndex(d => d.name === lord);

    const startDegree = nakshatraIndex * NAKSHATRA_SIZE;

    const traversed = moonLongitude - startDegree;

    const remainingFraction =
        (NAKSHATRA_SIZE - traversed) / NAKSHATRA_SIZE;

    const totalYears = DASHAS[dashaIndex].years;

    const balanceYears = totalYears * remainingFraction;

    const birth = new Date(birthDate);

    const endDate = new Date(birth);

    endDate.setDate(
        endDate.getDate() + Math.round(balanceYears * 365.25)
    );

    let timeline = [];

    let currentDate = new Date(endDate);

    let index = (dashaIndex + 1) % 9;

    for (let i = 0; i < 8; i++) {

        const start = new Date(currentDate);

        const end = new Date(start);

        end.setDate(
            end.getDate() + Math.round(DASHAS[index].years * 365.25)
        );

        timeline.push({

            dasha: DASHAS[index].name,

            from: start.toISOString().substring(0,10),

            to: end.toISOString().substring(0,10)

        });

        currentDate = end;

        index = (index + 1) % 9;
    }

    return {

        birthMahadasha: lord,

        balanceYears: Number(balanceYears.toFixed(2)),

        balanceEnds: endDate.toISOString().substring(0,10),

        timeline

    };

}

module.exports = {
    calculate
};