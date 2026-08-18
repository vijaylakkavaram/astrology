const startDate =
    document.getElementById("startDate");

const days =
    document.getElementById("days");

const muhuratType =
    document.getElementById("muhuratType");

const latitude =
    document.getElementById("latitude");

const longitude =
    document.getElementById("longitude");

const timezone =
    document.getElementById("timezone");

const searchButton =
    document.getElementById("searchButton");

const loading =
    document.getElementById("loading");

const error =
    document.getElementById("error");

const results =
    document.getElementById("results");

const summary =
    document.getElementById("summary");

const summaryText =
    document.getElementById("summaryText");

const resultsBody =
    document.getElementById("resultsBody");


// Default date = today

startDate.value =
    new Date()
        .toISOString()
        .slice(0, 10);


// Button

searchButton.addEventListener(
    "click",
    findMuhurats
);


// ======================================================
// Find Muhurats
// ======================================================

async function findMuhurats() {

    error.style.display = "none";

    results.style.display = "none";

    summary.style.display = "none";

    loading.style.display = "block";


    try {

        const response =
            await fetch(
                "/api/muhurat/find",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        startDate:
                            startDate.value,

                        days:
                            Number(days.value),

                        latitude:
                            Number(latitude.value),

                        longitude:
                            Number(longitude.value),

                        timezone:
                            timezone.value,

                        type:
                            muhuratType.value

                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Unable to find Muhurats"
            );
        }


        displayResults(data);


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


// ======================================================
// Display
// ======================================================

function displayResults(data) {

    resultsBody.innerHTML = "";


    if (
        !data.results ||
        data.results.length === 0
    ) {

        summary.style.display = "block";

        summaryText.textContent =
            `No suitable Muhurat found in the next ${data.days} days.`;

        return;
    }


    summary.style.display = "block";

    summaryText.textContent =
        `Found ${data.results.length} suitable Muhurat dates in the next ${data.days} days.`;


    data.results.forEach(item => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>
                    ${item.date}
                </strong>
            </td>

            <td>
                ${item.panchanga.vara}
            </td>

            <td>
                ${item.panchanga.tithi.name}
            </td>

            <td>
                ${item.panchanga.nakshatra.name}
            </td>

            <td>
                ${item.panchanga.yoga.name}
            </td>

            <td>
                ${item.sunrise}
            </td>

            <td>
                ${item.sunset}
            </td>

            <td>
                ${item.abhijitMuhurat.start}
                -
                ${item.abhijitMuhurat.end}
            </td>

            <td>
                <strong>
                    ${item.evaluation.score}
                </strong>
            </td>

            <td>
                ${item.evaluation.quality}
            </td>

        `;


        resultsBody.appendChild(row);

    });


    results.style.display = "block";
}
