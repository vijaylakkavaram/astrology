const dateInput =
    document.getElementById(
        "muhuratDate"
    );

const typeInput =
    document.getElementById(
        "muhuratType"
    );

const latitudeInput =
    document.getElementById(
        "latitude"
    );

const longitudeInput =
    document.getElementById(
        "longitude"
    );

const timezoneInput =
    document.getElementById(
        "timezone"
    );

const button =
    document.getElementById(
        "calculateButton"
    );

const result =
    document.getElementById(
        "result"
    );

const loading =
    document.getElementById(
        "loading"
    );

const error =
    document.getElementById(
        "error"
    );


// Default date
dateInput.value =
    new Date()
        .toISOString()
        .slice(0, 10);


button.addEventListener(
    "click",
    calculate
);


async function calculate() {

    error.style.display = "none";

    result.style.display = "none";

    loading.style.display = "block";


    try {

        const response =
            await fetch(
                "/api/muhurat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        date:
                            dateInput.value,

                        latitude:
                            Number(
                                latitudeInput.value
                            ),

                        longitude:
                            Number(
                                longitudeInput.value
                            ),

                        timezone:
                            timezoneInput.value,

                        type:
                            typeInput.value

                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Muhurat calculation failed"
            );
        }


        displayResult(data);


    } catch (err) {

        error.textContent =
            err.message;

        error.style.display =
            "block";

    } finally {

        loading.style.display =
            "none";
    }
}


function displayResult(data) {

    result.style.display =
        "block";


    document.getElementById(
        "vara"
    ).textContent =
        data.panchanga.vara;


    document.getElementById(
        "tithi"
    ).textContent =
        `${data.panchanga.tithi.name}
         (${data.panchanga.tithi.percentage}%)`;


    document.getElementById(
        "nakshatra"
    ).textContent =
        `${data.panchanga.nakshatra.name}
         (${data.panchanga.nakshatra.percentage}%)`;


    document.getElementById(
        "yoga"
    ).textContent =
        `${data.panchanga.yoga.name}
         (${data.panchanga.yoga.percentage}%)`;


    document.getElementById(
        "karana"
    ).textContent =
        data.panchanga.karana.name;


    document.getElementById(
        "sunrise"
    ).textContent =
        data.sunrise;


    document.getElementById(
        "sunset"
    ).textContent =
        data.sunset;


    document.getElementById(
        "rahu"
    ).textContent =
        `${data.rahuKalam.start}
         - ${data.rahuKalam.end}`;


    document.getElementById(
        "yamaganda"
    ).textContent =
        `${data.yamaganda.start}
         - ${data.yamaganda.end}`;


    document.getElementById(
        "gulika"
    ).textContent =
        `${data.gulikaKalam.start}
         - ${data.gulikaKalam.end}`;


    document.getElementById(
        "abhijit"
    ).textContent =
        `${data.abhijitMuhurat.start}
         - ${data.abhijitMuhurat.end}`;


    // Choghadiya

    const choghadiya =
        document.getElementById(
            "choghadiya"
        );

    choghadiya.innerHTML = "";


    data.choghadiya.forEach(
        item => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${item.name}
                </td>

                <td>
                    ${item.start}
                </td>

                <td>
                    ${item.end}
                </td>

                <td>
                    ${
                        item.auspicious
                            ? "Auspicious"
                            : "Avoid"
                    }
                </td>

            `;


            choghadiya.appendChild(
                row
            );
        }
    );


    // Evaluation

    document.getElementById(
        "score"
    ).textContent =
        data.evaluation.score;


    document.getElementById(
        "quality"
    ).textContent =
        data.evaluation.quality;


    const reasons =
        document.getElementById(
            "reasons"
        );

    reasons.innerHTML = "";


    data.evaluation.reasons
        .forEach(reason => {

            const li =
                document.createElement(
                    "li"
                );

            li.textContent =
                reason;

            reasons.appendChild(li);

        });


    const warnings =
        document.getElementById(
            "warnings"
        );

    warnings.innerHTML = "";


    data.evaluation.warnings
        .forEach(warning => {

            const li =
                document.createElement(
                    "li"
                );

            li.textContent =
                warning;

            warnings.appendChild(li);

        });
}
