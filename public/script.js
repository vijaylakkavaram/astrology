/* =========================================================
   KUNDALI FRONTEND - COMPLETE SCRIPT
   Features:
   1. Current Date / Time
   2. Form Handling
   3. Kundali API
   4. South Indian D1 Chart
   5. Navamsa D9 Chart
   6. Panchang
   7. Vimshottari Dasha / Bhukthi
   8. Planet Details
   9. Retrograde
   10. Combustion
   11. Mandhi
   12. Current Location
   13. Place Search
   ========================================================= */


/* =========================================================
   1. CONSTANTS
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


const CHART_LAYOUT = [
    11, 0, 1, 2,
    10, -1, -1, 3,
    9, -1, -1, 4,
    8, 7, 6, 5
];


const TIMEZONE = 5.5;


const PLANET_SYMBOLS = {

    Sun: "☉",

    Moon: "☽",

    Mars: "♂",

    Mercury: "☿",

    Jupiter: "♃",

    Venus: "♀",

    Saturn: "♄",

    Rahu: "☊",

    Ketu: "☋"

};


/* =========================================================
   2. INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);


function initializeApp() {

    setCurrentDateTime();

    setupForm();

    setupLocation();

}


/* =========================================================
   3. CURRENT DATE / TIME
   ========================================================= */

function setCurrentDateTime() {

    const dateInput =
        document.getElementById("date");

    const timeInput =
        document.getElementById("time");


    if (!dateInput || !timeInput) {

        return;

    }


    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            now.getDate()
        ).padStart(2, "0");


    const hours =
        String(
            now.getHours()
        ).padStart(2, "0");


    const minutes =
        String(
            now.getMinutes()
        ).padStart(2, "0");


    dateInput.value =
        `${year}-${month}-${day}`;


    timeInput.value =
        `${hours}:${minutes}`;

}


/* =========================================================
   4. FORM SETUP
   ========================================================= */

function setupForm() {

    const form =
        document.getElementById(
            "kundaliForm"
        );


    if (!form) {

        console.warn(
            "kundaliForm not found"
        );

        return;

    }


    form.addEventListener(
        "submit",
        generateKundali
    );

}


/* =========================================================
   5. GENERATE KUNDALI
   ========================================================= */

async function generateKundali(event) {

    event.preventDefault();


    try {

        const formData =
            collectFormData();


        validateFormData(
            formData
        );


        showLoadingState();


        const data =
            await fetchKundali(
                formData
            );


        validateApiResponse(
            data
        );


        renderAll(
            data
        );


        const result =
            document.getElementById(
                "result"
            );


        if (result) {

            result.innerHTML =
                "✅ Kundali generated successfully.";

        }

    }
    catch (error) {

        console.error(
            "Kundali generation error:",
            error
        );


        const result =
            document.getElementById(
                "result"
            );


        if (result) {

            result.innerHTML =
                `
                <span style="color:red;">
                    ❌ ${escapeHtml(
                        error.message ||
                        "Unable to generate Kundali."
                    )}
                </span>
                `;

        }

        alert(
            error.message ||
            "Unable to generate Kundali."
        );

    }

}


/* =========================================================
   6. COLLECT FORM DATA
   ========================================================= */

function collectFormData() {

    return {

        name:
            getValue("name"),

        date:
            getValue("date"),

        time:
            getValue("time"),

        place:
            getValue("place"),

        latitude:
            Number(
                getValue("latitude")
            ),

        longitude:
            Number(
                getValue("longitude")
            ),

        // Timezone is hidden from the user
        // but always sent to backend.
        timezone:
            TIMEZONE

    };

}


/* =========================================================
   7. GET INPUT VALUE
   ========================================================= */

function getValue(id) {

    const element =
        document.getElementById(id);


    if (!element) {

        return "";

    }


    return element.value;

}


/* =========================================================
   8. VALIDATE FORM
   ========================================================= */

function validateFormData(data) {

    if (!data.date) {

        throw new Error(
            "Please select date."
        );

    }


    if (!data.time) {

        throw new Error(
            "Please select time."
        );

    }


    if (
        !Number.isFinite(
            data.latitude
        )
    ) {

        throw new Error(
            "Please enter/select latitude."
        );

    }


    if (
        !Number.isFinite(
            data.longitude
        )
    ) {

        throw new Error(
            "Please enter/select longitude."
        );

    }

}


/* =========================================================
   9. API CALL
   ========================================================= */

async function fetchKundali(data) {

    const response =
        await fetch(
            "/api/kundali",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(data)

            }
        );


    if (!response.ok) {

        throw new Error(
            `API failed: ${response.status}`
        );

    }


    return response.json();

}


/* =========================================================
   10. VALIDATE API RESPONSE
   ========================================================= */

function validateApiResponse(data) {

    if (!data) {

        throw new Error(
            "Empty Kundali API response."
        );

    }


    if (
        !Array.isArray(
            data.planets
        )
    ) {

        throw new Error(
            "API response does not contain planets."
        );

    }


    if (!data.lagna) {

        throw new Error(
            "API response does not contain lagna."
        );

    }

}


/* =========================================================
   11. RENDER EVERYTHING
   ========================================================= */

function renderAll(data) {

    console.log(
        "Kundali data received:",
        data
    );


    renderRashiChart(
        data
    );


    renderNavamsaChart(
        data
    );


    renderPanchang(
        data
    );


    renderDasha(
        data
    );


    renderPlanetDetails(
        data
    );


    renderMandhiDetails(
        data
    );


    // NEW
    renderVargaCharts(data);

    // NEW
    renderYogas(data);

        renderShadbala(data);



}


/* =========================================================
   12. D1 RASHI CHART
   ========================================================= */

function renderRashiChart(data) {

    const chart =
        document.getElementById(
            "kundali"
        );


    if (!chart) {

        return;

    }


    chart.style.display =
        "grid";


    drawSouthIndianChart(

        "kundali",

        data.planets,

        data.lagna.rashi,

        "KUNDALI",

        "rashi",

        data.mandhi

    );

}


/* =========================================================
   13. D9 NAVAMSA CHART
   ========================================================= */

function renderNavamsaChart(data) {

    const chart =
        document.getElementById(
            "navamsaKundali"
        );


    if (!chart) {

        return;

    }


    const navamsaLagna =
        data.lagna.navamsaRashi;


    if (!navamsaLagna) {

        console.warn(
            "Navamsa Lagna is missing."
        );


        chart.style.display =
            "none";


        return;

    }


    chart.style.display =
        "grid";


    drawSouthIndianChart(

        "navamsaKundali",

        data.planets,

        navamsaLagna,

        "NAVAMSA",

        "navamsaRashi",

        null

    );

}


/* =========================================================
   14. SOUTH INDIAN CHART ENGINE
   ========================================================= */

function drawSouthIndianChart(

    containerId,

    planetData,

    lagnaSign,

    title,

    rashiProperty = "rashi",

    mandhi = null

) {

    const chart =
        document.getElementById(
            containerId
        );


    if (!chart) {

        return;

    }


    chart.innerHTML =
        "";


    const planetsByRashi =
        createRashiMap();


    addPlanetsToRashiMap(

        planetsByRashi,

        planetData,

        rashiProperty

    );


    addMandhiToRashiMap(

        planetsByRashi,

        mandhi

    );


    CHART_LAYOUT.forEach(
        index => {

            if (index === -1) {

                createChartCenter(

                    chart,

                    title

                );


                return;

            }


            createChartHouse(

                chart,

                RASHIS[index],

                planetsByRashi,

                lagnaSign

            );

        }
    );

}


/* =========================================================
   15. CREATE RASHI MAP
   ========================================================= */

function createRashiMap() {

    const map = {};


    RASHIS.forEach(
        sign => {

            map[sign] = [];

        }
    );


    return map;

}


/* =========================================================
   16. ADD PLANETS TO CHART
   ========================================================= */

function addPlanetsToRashiMap(

    map,

    planets,

    rashiProperty

) {

    (planets || []).forEach(
        planet => {

            const sign =
                planet[rashiProperty];


            if (
                !sign ||
                !map[sign]
            ) {

                return;

            }


            const symbol =
                PLANET_SYMBOLS[
                    planet.planet
                ] || "";


            const planetText =
                symbol
                    ? `${symbol} ${planet.planet}`
                    : planet.planet;


            map[sign].push(
                planetText
            );

        }
    );

}


/* =========================================================
   17. ADD MANDHI TO CHART
   ========================================================= */

function addMandhiToRashiMap(
    map,
    mandhi
) {

    if (
        !mandhi ||
        !mandhi.rashi
    ) {

        return;

    }


    if (!map[mandhi.rashi]) {

        return;

    }


    map[
        mandhi.rashi
    ].push(
        "⚫ Maṁ"
    );

}


/* =========================================================
   18. CHART CENTER
   ========================================================= */

function createChartCenter(
    chart,
    title
) {

    const div =
        document.createElement(
            "div"
        );


    div.className =
        "center";


    div.innerHTML =
        `
        🪔
        <br>
        ${escapeHtml(title)}
        `;


    chart.appendChild(
        div
    );

}


/* =========================================================
   19. CHART HOUSE
   ========================================================= */

function createChartHouse(

    chart,

    sign,

    planetsByRashi,

    lagnaSign

) {

    const div =
        document.createElement(
            "div"
        );


    div.className =
        "house";


    if (
        sign === lagnaSign
    ) {

        div.classList.add(
            "lagna"
        );

    }


    const planets =
        planetsByRashi[sign] || [];


    div.innerHTML = `

        <h3>
            ${escapeHtml(sign)}
        </h3>

        <p>

            ${
                planets.length
                    ? planets.join("<br>")
                    : ""
            }

        </p>

        ${
            sign === lagnaSign

                ? `
                    <div class="lagnaLabel">
                        Lagna
                    </div>
                  `

                : ""
        }

    `;


    chart.appendChild(
        div
    );

}


/* =========================================================
   20. PANCHANG
   ========================================================= */

function renderPanchang(data) {

    const card =
        document.getElementById(
            "panchangCard"
        );


    if (!card) {

        return;

    }


    const panchang =
        data.panchang;


    if (!panchang) {

        card.innerHTML =
            `
            <h3>🕉️ Panchang</h3>
            <p>Panchang unavailable.</p>
            `;

        return;

    }


    card.innerHTML = `

        <h3>
            🕉️ Panchang
        </h3>

        <table>

            <tr>
                <td>Weekday</td>
                <td>
                    ${escapeHtml(
                        panchang.weekday || "-"
                    )}
                </td>
            </tr>

            <tr>
                <td>Paksha</td>
                <td>
                    ${escapeHtml(
                        panchang.paksha || "-"
                    )}
                </td>
            </tr>

            <tr>
                <td>Tithi</td>
                <td>
                    ${escapeHtml(
                        panchang.tithi || "-"
                    )}
                </td>
            </tr>

            <tr>
                <td>Nakshatra</td>
                <td>
                    ${escapeHtml(
                        panchang.nakshatra || "-"
                    )}
                </td>
            </tr>

            <tr>
                <td>Pada</td>
                <td>
                    ${escapeHtml(
                        panchang.pada ?? "-"
                    )}
                </td>
            </tr>

            <tr>
                <td>Yoga</td>
                <td>
                    ${escapeHtml(
                        panchang.yoga || "-"
                    )}
                </td>
            </tr>

            <tr>
                <td>Karana</td>
                <td>
                    ${escapeHtml(
                        panchang.karana || "-"
                    )}
                </td>
            </tr>

        </table>

    `;

 }


/* =========================================================
   21. DASHA
   ========================================================= */

function renderDasha(data) {

    const card =
        document.getElementById(
            "dashaCard"
        );


    if (!card) {

        return;

    }


    const dasha =
        data.dasha;


    if (!dasha) {

        card.innerHTML =
            `
            <h3>🪐 Dasha</h3>
            <p>Dasha unavailable.</p>
            `;

        return;

    }


    const timeline =
        Array.isArray(
            dasha.timeline
        )
            ? dasha.timeline
            : [];


    card.innerHTML = `

        <div class="dashaHeader">

            <div class="dashaOm">
                🕉️
            </div>

            <div>

                <h2>
                    VIMSHOTTARI DASHA
                </h2>

                <p>
                    Planetary Periods
                </p>

            </div>

        </div>


        <div class="currentDashaGrid">


            <div class="currentDashaCard">

                <div class="periodLabel">
                    BIRTH MAHADASHA
                </div>

                <div class="planetLarge">

                    ${
                        PLANET_SYMBOLS[
                            dasha.birthMahadasha
                        ] || "🪐"
                    }

                </div>

                <div class="planetTitle">

                    ${escapeHtml(
                        dasha.birthMahadasha ||
                        "-"
                    )}

                </div>

            </div>


            <div
                class="
                    currentDashaCard
                    activePeriod
                "
            >

                <div class="periodLabel">
                    BIRTH BHUKTHI
                </div>

                <div class="planetLarge">

                    ${
                        PLANET_SYMBOLS[
                            dasha.birthBhukthi
                        ] || "🪐"
                    }

                </div>

                <div class="planetTitle">

                    ${escapeHtml(
                        dasha.birthBhukthi ||
                        "-"
                    )}

                </div>

                <div class="currentText">

                    ⭐ AT BIRTH

                </div>

            </div>

        </div>


        <div class="dashaInfoGrid">

            <div>

                <span>
                    Balance
                </span>

                <strong>

                    ${
                        dasha.balanceYears ??
                        "-"
                    }

                    Years

                </strong>

            </div>


            <div>

                <span>
                    Balance Ends
                </span>

                <strong>

                    ${escapeHtml(
                        dasha.balanceEnds ||
                        "-"
                    )}

                </strong>

            </div>

        </div>


        <div class="dashaSection">

            <div class="sectionTitle">

                🪐 MAHADASHA SEQUENCE

            </div>


            <div class="dashaSequence">

                ${
                    timeline.length

                        ? timeline
                            .map(
                                createMahadashaItem
                            )
                            .join("")

                        : `
                            <div class="noDashaData">
                                Timeline unavailable
                            </div>
                          `
                }

            </div>

        </div>

    `;

}


/* =========================================================
   22. MAHADASHA ITEM
   ========================================================= */

function createMahadashaItem(
    item,
    index
) {

    const planet =
        item.dasha ||
        item.planet ||
        "-";


    return `

        ${
            index > 0

                ? `
                    <div class="sequenceArrow">
                        →
                    </div>
                  `

                : ""
        }


        <div class="mahaSequenceItem">

            <div class="mahaIcon">

                ${
                    PLANET_SYMBOLS[
                        planet
                    ] || "🪐"
                }

            </div>


            <div class="mahaName">

                ${escapeHtml(
                    planet
                )}

            </div>


            <div class="mahaDates">

                ${escapeHtml(
                    item.from ||
                    item.start ||
                    "-"
                )}

                <br>

                ${escapeHtml(
                    item.to ||
                    item.end ||
                    "-"
                )}

            </div>


            <details
                class="bhukthiDetails"
            >

                <summary>
                    Bhukthi
                </summary>


                ${
                    renderBhukthiList(
                        item.bhukthis
                    )
                }

            </details>

        </div>

    `;

}


/* =========================================================
   23. BHUKTHI LIST
   ========================================================= */

function renderBhukthiList(
    bhukthis
) {

    if (
        !Array.isArray(
            bhukthis
        ) ||
        !bhukthis.length
    ) {

        return `

            <div class="noDashaData">

                No Bhukthi data

            </div>

        `;

    }


    return `

        <div class="bhukthiList">

            ${
                bhukthis
                    .map(
                        bhukthi => `

                            <div
                                class="bhukthiRow"
                            >

                                <strong>

                                    ${escapeHtml(
                                        bhukthi.bhukthi ||
                                        bhukthi.planet ||
                                        "-"
                                    )}

                                </strong>


                                <span>

                                    ${escapeHtml(
                                        bhukthi.from ||
                                        bhukthi.start ||
                                        "-"
                                    )}

                                </span>


                                <span>
                                    →
                                </span>


                                <span>

                                    ${escapeHtml(
                                        bhukthi.to ||
                                        bhukthi.end ||
                                        "-"
                                    )}

                                </span>

                            </div>

                        `
                    )
                    .join("")
            }

        </div>

    `;

}


/* =========================================================
   24. PLANET DETAILS
   ========================================================= */

function renderPlanetDetails(data) {

    const card =
        document.getElementById(
            "planetDetailsCard"
        );


    if (!card) {

        return;

    }


    const planets =
        data.planets || [];


    if (!planets.length) {

        card.style.display =
            "none";

        return;

    }


    card.style.display =
        "block";


    card.innerHTML = `

        <h2>
            🪐 Planet Details
        </h2>


        <div
            class="planetTableWrapper"
        >

            <table
                class="planetDetailsTable"
            >

                <thead>

                    <tr>

                        <th>
                            Planet
                        </th>

                        <th>
                            Rashi
                        </th>

                        <th>
                            House
                        </th>

                        <th>
                            Degree
                        </th>

                        <th>
                            Nakshatra
                        </th>

                        <th>
                            Nakshatra Lord
                        </th>

                        <th>
                            Sub Lord
                        </th>

                        <th>
                            Sookshma Daipathi
                        </th>

                        <th>
                            Pada
                        </th>

                        <th>
                            Motion
                        </th>

                        <th>
                            Combustion
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${
                        planets
                            .map(
                                createPlanetRow
                            )
                            .join("")
                    }

                </tbody>

            </table>

        </div>

    `;

}


/* =========================================================
   25. CREATE PLANET ROW
   ========================================================= */

function createPlanetRow(
    planet
) {

    const isRetro =
        planet.retrograde === true;


    const isCombust =
        planet.combust === true;


    const symbol =
        PLANET_SYMBOLS[
            planet.planet
        ] || "";


    return `

        <tr>


            <td
                class="planetName"
            >

                <span
                    class="planetSymbol"
                >

                    ${symbol}

                </span>


                ${escapeHtml(
                    planet.planet ||
                    "-"
                )}

            </td>


            <td>

                ${escapeHtml(
                    planet.rashi ||
                    "-"
                )}

            </td>


            <td>

                ${planet.house ?? "-"}

            </td>


            <td>

                ${planet.degree ?? "-"}°

            </td>


            <td>

                ${escapeHtml(
                    planet.nakshatra ||
                    "-"
                )}

            </td>


            <td>

                ${escapeHtml(
                    planet.nakshatraLord ||
                    "-"
                )}

            </td>


            <td>

                ${escapeHtml(
                    planet.subLord ||
                    "-"
                )}

            </td>


            <td>

                ${escapeHtml(
                    planet.sookshmaDaipathi ||
                    "-"
                )}

            </td>


            <td>

                ${planet.pada ?? "-"}

            </td>


            <td>

                <span
                    class="${
                        isRetro
                            ? "motionRetro"
                            : "motionDirect"
                    }"
                >

                    ${
                        isRetro

                            ? "🔴 Retro"

                            : "🟢 Direct"
                    }

                </span>

            </td>


            <td>

                ${
                    isCombust

                        ? `
                            <span
                                class="
                                    combustStatus
                                "
                            >

                                🔥 Combust

                            </span>
                          `

                        : `
                            <span
                                class="
                                    normalStatus
                                "
                            >

                                —

                            </span>
                          `
                }

            </td>


        </tr>

    `;

}


/* =========================================================
   26. LAGNA + MANDHI DETAILS
   ========================================================= */

function renderMandhiDetails(data) {

    const mainCard =
        document.getElementById(
            "planetDetailsCard"
        );


    if (!mainCard) {

        return;

    }


    const lagna =
        data.lagna || {};


    const mandhi =
        data.mandhi || {};


    let card =
        document.getElementById(
            "lagnaDetailsCard"
        );


    if (!card) {

        card =
            document.createElement(
                "div"
            );


        card.id =
            "lagnaDetailsCard";


        card.className =
            "detailsCard";


        mainCard.parentNode.insertBefore(

            card,

            mainCard.nextSibling

        );

    }


    card.style.display =
        "block";


    card.innerHTML = `

        <h2>
            ♈ Lagna & ⚫ Mandhi
        </h2>


        <div
            class="planetTableWrapper"
        >

            <table
                class="planetDetailsTable"
            >

                <thead>

                    <tr>

                        <th>
                            Type
                        </th>

                        <th>
                            Rashi
                        </th>

                        <th>
                            House
                        </th>

                        <th>
                            Degree
                        </th>

                        <th>
                            Nakshatra
                        </th>

                        <th>
                            Pada
                        </th>

                    </tr>

                </thead>


                <tbody>


                    <tr>

                        <td>
                            ♈ Lagna
                        </td>

                        <td>

                            ${escapeHtml(
                                lagna.rashi ||
                                "-"
                            )}

                        </td>

                        <td>
                            1
                        </td>

                        <td>

                            ${lagna.degree ?? "-"}°

                        </td>

                        <td>

                            ${escapeHtml(
                                lagna.nakshatra ||
                                "-"
                            )}

                        </td>

                        <td>

                            ${lagna.pada ?? "-"}

                        </td>

                    </tr>


                    <tr>

                        <td>
                            ⚫ Mandhi
                        </td>

                        <td>

                            ${escapeHtml(
                                mandhi.rashi ||
                                "-"
                            )}

                        </td>

                        <td>

                            ${mandhi.house ?? "-"}

                        </td>

                        <td>

                            ${mandhi.degree ?? "-"}°

                        </td>

                        <td>

                            ${escapeHtml(
                                mandhi.nakshatra ||
                                "-"
                            )}

                        </td>

                        <td>

                            ${mandhi.pada ?? "-"}

                        </td>

                    </tr>


                </tbody>

            </table>

        </div>

    `;

}


/* =========================================================
   27. LOCATION SETUP
   ========================================================= */

function setupLocation() {

    const button =
        document.getElementById(
            "locationBtn"
        );


    if (button) {

        button.addEventListener(
            "click",
            getLocation
        );

    }


    setupLocationAutocomplete();

}


/* =========================================================
   28. CURRENT DEVICE LOCATION
   ========================================================= */

function getLocation() {

    if (
        !navigator.geolocation
    ) {

        alert(
            "Geolocation is not supported by your browser."
        );


        return;

    }


    const button =
        document.getElementById(
            "locationBtn"
        );


    if (button) {

        button.textContent =
            "📍 Detecting...";

    }


    navigator.geolocation.getCurrentPosition(

        handleLocationSuccess,

        handleLocationError,

        {

            enableHighAccuracy:
                true,

            timeout:
                10000,

            maximumAge:
                0

        }

    );

}


/* =========================================================
   29. LOCATION SUCCESS
   ========================================================= */

function handleLocationSuccess(
    position
) {

    const latitude =
        position.coords.latitude;


    const longitude =
        position.coords.longitude;


    setLocationCoordinates(

        latitude,

        longitude

    );


    const button =
        document.getElementById(
            "locationBtn"
        );


    if (button) {

        button.textContent =
            "✅ Location Detected";

    }

}


/* =========================================================
   30. LOCATION ERROR
   ========================================================= */

function handleLocationError(
    error
) {

    const button =
        document.getElementById(
            "locationBtn"
        );


    if (button) {

        button.textContent =
            "📍 Use My Location";

    }


    switch (
        error.code
    ) {

        case error.PERMISSION_DENIED:

            alert(
                "Please allow location access."
            );

            break;


        case error.POSITION_UNAVAILABLE:

            alert(
                "Location information is unavailable."
            );

            break;


        case error.TIMEOUT:

            alert(
                "Location request timed out."
            );

            break;


        default:

            alert(
                "Unable to detect location."
            );

    }

}


/* =========================================================
   31. SET LOCATION COORDINATES
   ========================================================= */

function setLocationCoordinates(

    latitude,

    longitude

) {

    const latitudeInput =
        document.getElementById(
            "latitude"
        );


    const longitudeInput =
        document.getElementById(
            "longitude"
        );


    if (latitudeInput) {

        latitudeInput.value =
            Number(
                latitude
            ).toFixed(6);

    }


    if (longitudeInput) {

        longitudeInput.value =
            Number(
                longitude
            ).toFixed(6);

    }

}


/* =========================================================
   32. LOCATION AUTOCOMPLETE
   ========================================================= */

let locationTimer =
    null;


function setupLocationAutocomplete() {

    const input =
        document.getElementById(
            "place"
        );


    if (!input) {

        return;

    }


    input.addEventListener(
        "input",
        handlePlaceInput
    );


    document.addEventListener(
        "click",
        handleOutsideLocationClick
    );

}


/* =========================================================
   33. PLACE INPUT
   ========================================================= */

function handlePlaceInput(
    event
) {

    const text =
        event.target.value.trim();


    clearLocationCoordinates();


    clearTimeout(
        locationTimer
    );


    if (
        text.length < 2
    ) {

        hideLocationSuggestions();

        return;

    }


    locationTimer =
        setTimeout(

            () => {

                searchLocations(
                    text
                );

            },

            400

        );

}


/* =========================================================
   34. CLEAR COORDINATES
   ========================================================= */

function clearLocationCoordinates() {

    const latitude =
        document.getElementById(
            "latitude"
        );


    const longitude =
        document.getElementById(
            "longitude"
        );


    if (latitude) {

        latitude.value =
            "";

    }


    if (longitude) {

        longitude.value =
            "";

    }

}


/* =========================================================
   35. SEARCH PLACES
   ========================================================= */

async function searchLocations(
    text
) {

    const suggestions =
        document.getElementById(
            "locationSuggestions"
        );


    if (!suggestions) {

        return;

    }


    try {

        suggestions.style.display =
            "block";


        suggestions.innerHTML = `

            <div
                class="locationSuggestion"
            >

                Searching locations...

            </div>

        `;


        const response =
            await fetch(

                `/api/locations?text=${
                    encodeURIComponent(text)
                }`

            );


        if (!response.ok) {

            throw new Error(
                `Location API failed: ${
                    response.status
                }`
            );

        }


        const data =
            await response.json();


        if (

            !data.success ||

            !Array.isArray(
                data.results
            ) ||

            !data.results.length

        ) {

            suggestions.innerHTML = `

                <div
                    class="locationSuggestion"
                >

                    No locations found

                </div>

            `;


            return;

        }


        suggestions.innerHTML =
            "";


        data.results.forEach(
            location => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "locationSuggestion";


                item.innerHTML = `

                    <div
                        class="locationName"
                    >

                        ${escapeHtml(
                            location.name ||
                            ""
                        )}

                    </div>


                    <div
                        class="locationDetails"
                    >

                        ${escapeHtml(
                            location.formatted ||
                            ""
                        )}

                    </div>

                `;


                item.addEventListener(

                    "click",

                    () => {

                        selectLocation(
                            location
                        );

                    }

                );


                suggestions.appendChild(
                    item
                );

            }
        );

    }
    catch (error) {

        console.error(
            "Location search error:",
            error
        );


        suggestions.innerHTML = `

            <div
                class="locationSuggestion"
            >

                Unable to search locations

            </div>

        `;

    }

}


/* =========================================================
   36. SELECT LOCATION
   ========================================================= */

function selectLocation(
    location
) {

    const place =
        document.getElementById(
            "place"
        );


    if (place) {

        place.value =
            location.formatted ||
            location.name ||
            "";

    }


    setLocationCoordinates(

        location.latitude,

        location.longitude

    );


    hideLocationSuggestions();


    console.log(
        "Selected location:",
        location
    );

}


/* =========================================================
   37. HIDE LOCATION SUGGESTIONS
   ========================================================= */

function hideLocationSuggestions() {

    const suggestions =
        document.getElementById(
            "locationSuggestions"
        );


    if (!suggestions) {

        return;

    }


    suggestions.style.display =
        "none";


    suggestions.innerHTML =
        "";

}


/* =========================================================
   38. OUTSIDE LOCATION CLICK
   ========================================================= */

function handleOutsideLocationClick(
    event
) {

    if (
        !event.target.closest(
            ".locationSearch"
        )
    ) {

        hideLocationSuggestions();

    }

}


/* =========================================================
   39. LOADING STATE
   ========================================================= */

function showLoadingState() {

    const result =
        document.getElementById(
            "result"
        );


    if (result) {

        result.innerHTML = `

            <span>
                ⏳ Calculating Kundali...
            </span>

        `;

    }


    /*
     * Hide generated results while
     * a new Kundali is being calculated.
     */

    const kundali =
        document.getElementById(
            "kundali"
        );


    if (kundali) {

        kundali.style.display =
            "none";

    }

}


/* =========================================================
   40. ESCAPE HTML
   ========================================================= */

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}
function renderVargaChart(data) {

    const select =
        document.getElementById(
            "vargaSelect"
        );

    const chart =
        document.getElementById(
            "vargaChart"
        );


    if (!select || !chart) {

        return;

    }


    function drawSelectedVarga() {

        const selected =
            select.value;


        const varga =
            data.vargas?.[
                selected
            ];


        if (!varga) {

            chart.innerHTML =
                "<p>Varga data unavailable.</p>";

            return;

        }


        console.log(
            selected,
            varga
        );


        /*
         * Once we confirm the exact
         * Node-Jhora VargaPoint shape,
         * use the same South Indian
         * chart renderer here.
         */

    }


    select.addEventListener(
        "change",
        drawSelectedVarga
    );


    drawSelectedVarga();

}

/* =========================================================
   VARGA CHARTS
   ========================================================= */

function renderVargaCharts(data) {

    const card =
        document.getElementById(
            "vargaCard"
        );


    if (!card) {

        return;

    }


    const vargas =
        data.vargas;


    if (
        !vargas ||
        Object.keys(vargas).length === 0
    ) {

        card.style.display =
            "none";

        return;

    }


    card.style.display =
        "block";


    card.innerHTML = `

        <h2>
            📊 Divisional / Varga Charts
        </h2>


        <div class="vargaControls">

            <label>
                Select Chart:
            </label>


            <select id="vargaSelect">

                <option value="D1">
                    D1 - Rashi
                </option>

                <option value="D2">
                    D2 - Hora
                </option>

                <option value="D3">
                    D3 - Drekkana
                </option>

                <option value="D4">
                    D4 - Chaturthamsa
                </option>

                <option value="D7">
                    D7 - Saptamsa
                </option>

                <option value="D9">
                    D9 - Navamsa
                </option>

                <option value="D10">
                    D10 - Dasamsa
                </option>

                <option value="D12">
                    D12 - Dwadashamsa
                </option>

                <option value="D16">
                    D16 - Shodasamsa
                </option>

                <option value="D20">
                    D20 - Vimshamsa
                </option>

                <option value="D24">
                    D24 - Chaturvimshamsa
                </option>

                <option value="D27">
                    D27 - Bhamsa
                </option>

                <option value="D30">
                    D30 - Trimshamsa
                </option>

                <option value="D40">
                    D40 - Khavedamsa
                </option>

                <option value="D45">
                    D45 - Akshavedamsa
                </option>

                <option value="D60">
                    D60 - Shashtiamsa
                </option>

            </select>

        </div>


        <div
            id="vargaTableContainer"
            class="vargaTableContainer">
        </div>

    `;


    const select =
        document.getElementById(
            "vargaSelect"
        );


    select.addEventListener(
        "change",
        function () {

            displaySelectedVarga(
                vargas,
                this.value
            );

        }
    );


    displaySelectedVarga(
        vargas,
        "D1"
    );

}

/* =========================================================
   DISPLAY SELECTED VARGA
   ========================================================= */

function displaySelectedVarga(
    vargas,
    selectedVarga
) {

    const container =
        document.getElementById(
            "vargaTableContainer"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    /*
     * Your structure is:
     *
     * vargas
     *   ├── Sun
     *   │    ├── D1
     *   │    ├── D2
     *   │    └── ...
     *   ├── Moon
     *   └── ...
     */


    const rows = [];


    Object.entries(
        vargas
    ).forEach(
        ([planet, planetVargas]) => {

            if (
                !planetVargas ||
                !planetVargas[
                    selectedVarga
                ]
            ) {

                return;

            }


            const value =
                planetVargas[
                    selectedVarga
                ];


            rows.push({

                planet,

                rashi:
                    value.rashi ||
                    "-",

                degree:
                    value.degree ??
                    value.degreeInNavamsa ??
                    "-",

                part:
                    value.part ??
                    "-",

                navamsaNumber:
                    value.navamsaNumber ??
                    "-"

            });

        }
    );


    if (!rows.length) {

        container.innerHTML = `

            <div class="noVargaData">

                No ${escapeHtml(
                    selectedVarga
                )} data available.

            </div>

        `;

        return;

    }


    container.innerHTML = `

        <table
            class="vargaTable">

            <thead>

                <tr>

                    <th>
                        Planet
                    </th>

                    <th>
                        Rashi
                    </th>

                    <th>
                        Degree
                    </th>

                    <th>
                        Part
                    </th>

                </tr>

            </thead>


            <tbody>

                ${
                    rows
                        .map(
                            row => `

                                <tr>

                                    <td
                                        class="vargaPlanet"
                                    >

                                        ${
                                            PLANET_SYMBOLS[
                                                row.planet
                                            ] || "🪐"
                                        }

                                        ${escapeHtml(
                                            row.planet
                                        )}

                                    </td>


                                    <td>

                                        ${escapeHtml(
                                            row.rashi
                                        )}

                                    </td>


                                    <td>

                                        ${
                                            row.degree === "-"
                                                ? "-"
                                                : `${row.degree}°`
                                        }

                                    </td>


                                    <td>

                                        ${row.part}

                                    </td>

                                </tr>

                            `
                        )
                        .join("")
                }

            </tbody>

        </table>

    `;

}

/* =========================================================
   YOGA DETAILS
   ========================================================= */

function renderYogas(data) {

    const card =
        document.getElementById(
            "yogaCard"
        );


    if (!card) {

        return;

    }


    const yogas =
        Array.isArray(
            data.yogas
        )
            ? data.yogas
            : [];


    card.style.display =
        "block";


    if (!yogas.length) {

        card.innerHTML = `

            <h2>
                🔱 Yoga Analysis
            </h2>

            <div class="noYogaData">

                No major Yogas detected
                from the current rules.

            </div>

        `;

        return;

    }


    card.innerHTML = `

        <h2>
            🔱 Yoga Analysis
        </h2>


        <div class="yogaGrid">

            ${
                yogas
                    .map(
                        createYogaCard
                    )
                    .join("")
            }

        </div>

    `;

}
/* =========================================================
   CREATE YOGA CARD
   ========================================================= */

function createYogaCard(
    yoga
) {

    return `

        <div class="singleYogaCard">


            <div class="yogaIcon">

                🔱

            </div>


            <div class="yogaContent">


                <h3>

                    ${escapeHtml(
                        yoga.name ||
                        "Yoga"
                    )}

                </h3>


                ${
                    yoga.type

                        ? `
                            <span
                                class="yogaType"
                            >

                                ${escapeHtml(
                                    yoga.type
                                )}

                            </span>
                          `

                        : ""
                }


                <p>

                    ${escapeHtml(
                        yoga.description ||
                        "No description available."
                    )}

                </p>


                ${
                    Array.isArray(
                        yoga.planets
                    ) &&
                    yoga.planets.length

                        ? `
                            <div
                                class="yogaPlanets"
                            >

                                🪐

                                ${yoga.planets
                                    .map(
                                        planet =>
                                            escapeHtml(
                                                planet
                                            )
                                    )
                                    .join(
                                        " • "
                                    )}

                            </div>
                          `

                        : ""
                }


            </div>


        </div>

    `;

}
/* =======================
==================================
   END OF SCRIPT
   ========================================================= */
   

 

  
   /* =========================================================
   VARGA CHARTS
   ========================================================= */

function renderVargaCharts(data) {

    const card =
        document.getElementById(
            "vargaCard"
        );


    if (!card) {

        return;

    }


    const vargas =
        data.vargas;


    if (
        !vargas ||
        Object.keys(vargas).length === 0
    ) {

        card.style.display =
            "none";

        return;

    }


    card.style.display =
        "block";


    card.innerHTML = `

        <h2>
            📊 Divisional / Varga Charts
        </h2>


        <div class="vargaControls">

            <label>
                Select Chart:
            </label>


            <select id="vargaSelect">

                <option value="D1">
                    D1 - Rashi
                </option>

                <option value="D2">
                    D2 - Hora
                </option>

                <option value="D3">
                    D3 - Drekkana
                </option>

                <option value="D4">
                    D4 - Chaturthamsa
                </option>

                <option value="D7">
                    D7 - Saptamsa
                </option>

                <option value="D9">
                    D9 - Navamsa
                </option>

                <option value="D10">
                    D10 - Dasamsa
                </option>

                <option value="D12">
                    D12 - Dwadashamsa
                </option>

                <option value="D16">
                    D16 - Shodasamsa
                </option>

                <option value="D20">
                    D20 - Vimshamsa
                </option>

                <option value="D24">
                    D24 - Chaturvimshamsa
                </option>

                <option value="D27">
                    D27 - Bhamsa
                </option>

                <option value="D30">
                    D30 - Trimshamsa
                </option>

                <option value="D40">
                    D40 - Khavedamsa
                </option>

                <option value="D45">
                    D45 - Akshavedamsa
                </option>

                <option value="D60">
                    D60 - Shashtiamsa
                </option>

            </select>

        </div>


        <div
            id="vargaTableContainer"
            class="vargaTableContainer">
        </div>

    `;


    const select =
        document.getElementById(
            "vargaSelect"
        );


    select.addEventListener(
        "change",
        function () {

            displaySelectedVarga(
                vargas,
                this.value
            );

        }
    );


    displaySelectedVarga(
        vargas,
        "D1"
    );

}

/* =========================================================
   SHADBALA UI
   ========================================================= */

function renderShadbala(data) {

    const card =
        document.getElementById(
            "shadbalaCard"
        );


    if (!card) {

        return;

    }


    const shadbala =
        data.shadbala;


    if (
        !Array.isArray(
            shadbala
        ) ||
        shadbala.length === 0
    ) {

        card.style.display =
            "none";

        return;

    }


    card.style.display =
        "block";


    card.innerHTML = `

        <h2>
            💪 Shadbala -
            Planetary Strength
        </h2>


        <div class="shadbalaWrapper">

            <table
                class="shadbalaTable">

                <thead>

                    <tr>

                        <th>
                            Planet
                        </th>

                        <th>
                            Sthana
                        </th>

                        <th>
                            Dig
                        </th>

                        <th>
                            Kala
                        </th>

                        <th>
                            Chesta
                        </th>

                        <th>
                            Naisargika
                        </th>

                        <th>
                            Drik
                        </th>

                        <th>
                            Total
                        </th>

                        <th>
                            Strength
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${
                        shadbala
                            .map(
                                createShadbalaRow
                            )
                            .join("")
                    }

                </tbody>

            </table>

        </div>

    `;

}
function createShadbalaRow(
    planet
) {

    const total =
        Number(
            planet.total || 0
        );


    let strength =
        "🟡 Average";


    if (
        total >= 300
    ) {

        strength =
            "🟢 Strong";

    }
    else if (
        total < 150
    ) {

        strength =
            "🔴 Weak";

    }


    return `

        <tr>

            <td class="shadbalaPlanet">

                ${
                    PLANET_SYMBOLS[
                        planet.planet
                    ] || "🪐"
                }

                ${escapeHtml(
                    planet.planet
                )}

            </td>


            <td>
                ${planet.sthanaBala ?? "-"}
            </td>


            <td>
                ${planet.digBala ?? "-"}
            </td>


            <td>
                ${planet.kalaBala ?? "-"}
            </td>


            <td>
                ${planet.chestaBala ?? "-"}
            </td>


            <td>
                ${planet.naisargikaBala ?? "-"}
            </td>


            <td>
                ${planet.drikBala ?? "-"}
            </td>


            <td class="shadbalaTotal">

                ${planet.total ?? "-"}

            </td>


            <td>

                ${strength}

            </td>

        </tr>

    `;

}
