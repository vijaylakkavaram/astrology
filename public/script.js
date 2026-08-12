// Set current date and time when page loads

window.onload = function () {

    const now = new Date();

    // Date (YYYY-MM-DD)
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    document.getElementById("date").value =
        `${year}-${month}-${day}`;

    // Time (HH:MM)
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    document.getElementById("time").value =
        `${hours}:${minutes}`;

};

const signs = [

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

const layout=[

11,0,1,2,
10,-1,-1,3,
9,-1,-1,4,
8,7,6,5

];
const timezone = 5.5;

document
.getElementById("kundaliForm")
.addEventListener("submit",generate);

async function generate(e){

e.preventDefault();

const body={

name:document.getElementById("name").value,

date:document.getElementById("date").value,

time:document.getElementById("time").value,

place:document.getElementById("place").value,

latitude:Number(document.getElementById("latitude").value),

longitude:Number(document.getElementById("longitude").value),

    timezone: 5.5,


};

const response=await fetch("/api/kundali",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(body)

});

const data=await response.json();
console.log("Kundali data received:", data);
 

 displayPlanetDetails(data);

document.getElementById("kundali").style.display = "grid";

drawKundali(data);

}

function drawKundali(data){

const chart=document.getElementById("kundali");

chart.innerHTML="";

const planets={};

signs.forEach(s=>planets[s]=[]);

const short={

Sun:"Su",
Moon:"Mo",
Mars:"Ma",
Mercury:"Me",
Jupiter:"Ju",
Venus:"Ve",
Saturn:"Sa",
Rahu:"Ra",
Ketu:"Ke"

};

data.planets.forEach(p=>{

planets[p.rashi].push(short[p.planet]);

});

layout.forEach(index=>{

if(index==-1){

const div=document.createElement("div");

div.className="center";

div.innerHTML="🪔<br>KUNDALI";

chart.appendChild(div);

return;

}

const sign=signs[index];

const div=document.createElement("div");

div.className="house";

if(sign===data.lagna.rashi){

div.classList.add("lagna");


}


div.innerHTML=`

<h3>${sign}</h3>

<p>${planets[sign].join("<br>")}</p>

 ${
                sign === data.lagna.rashi
                    ? `<div class="lagnaLabel">
                            Lagna
                       </div>`
                    : ""
            }

`;


chart.appendChild(div);

});

document.getElementById("panchangCard").innerHTML = `

<h3>Panchang</h3>

<table border="1" cellpadding="6">

<tr>
<td>Weekday</td>
<td>${data.panchang.weekday}</td>
</tr>

<tr>
<td>Paksha</td>
<td>${data.panchang.paksha}</td>
</tr>

<tr>
<td>Tithi</td>
<td>${data.panchang.tithi}</td>
</tr>

<tr>
<td>Nakshatra</td>
<td>${data.panchang.nakshatra}</td>
</tr>

<tr>
<td>Pada</td>
<td>${data.panchang.pada}</td>
</tr>

<tr>
<td>Yoga</td>
<td>${data.panchang.yoga}</td>
</tr>

<tr>
<td>Karana</td>
<td>${data.panchang.karana}</td>
</tr>

</table>

`;
document.getElementById("dashaCard").innerHTML = `

<h3>Vimshottari Dasha</h3>

<table>

<tr>
<td>Birth Mahadasha</td>
<td>${data.dasha.birthMahadasha}</td>
</tr>

<tr>
<td>Balance</td>
<td>${data.dasha.balanceYears} Years</td>
</tr>

<tr>
<td>Balance Ends</td>
<td>${data.dasha.balanceEnds}</td>
</tr>

</table>

<br>

<b>Timeline</b>

<table>

${data.dasha.timeline.map(d=>`

<tr>

<td>${d.dasha}</td>

<td>${d.from}<br>${d.to}</td>

</tr>

`).join("")}

</table>

`; 
}
document
    .getElementById("locationBtn")
    .addEventListener("click", getLocation);

function getLocation() {

    if (!navigator.geolocation) {

        alert("Geolocation is not supported by your browser.");

        return;
    }

    const button =
        document.getElementById("locationBtn");

    button.textContent = "📍 Detecting...";

    navigator.geolocation.getCurrentPosition(

        function (position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            document.getElementById("latitude").value =
                latitude.toFixed(6);

            document.getElementById("longitude").value =
                longitude.toFixed(6);

            button.textContent =
                "✅ Location Detected";

        },

        function (error) {

            button.textContent =
                "📍 Use My Location";

            switch (error.code) {

                case error.PERMISSION_DENIED:
                    alert("Please allow location access.");
                    break;

                case error.POSITION_UNAVAILABLE:
                    alert("Location information is unavailable.");
                    break;

                case error.TIMEOUT:
                    alert("Location request timed out.");
                    break;

                default:
                    alert("Unable to detect location.");
            }

        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }

    );

}
 // =====================================================
// LOCATION AUTOCOMPLETE
// =====================================================

const placeInput =
    document.getElementById("place");

const locationSuggestions =
    document.getElementById(
        "locationSuggestions"
    );


let locationTimer = null;


// =====================================================
// USER TYPES LOCATION
// =====================================================

placeInput.addEventListener(
    "input",
    function () {

        const text =
            this.value.trim();


        // Clear previous coordinates
        document.getElementById(
            "latitude"
        ).value = "";

        document.getElementById(
            "longitude"
        ).value = "";


        clearTimeout(
            locationTimer
        );


        if (text.length < 2) {

            hideLocationSuggestions();

            return;

        }


        // Wait until user stops typing
        locationTimer =
            setTimeout(
                () => {

                    searchLocations(text);

                },
                400
            );

    }
);


// =====================================================
// SEARCH LOCATIONS
// =====================================================

async function searchLocations(text) {

    try {

        locationSuggestions.style.display =
            "block";


        locationSuggestions.innerHTML = `
            <div class="locationSuggestion">
                Searching locations...
            </div>
        `;


        const response =
            await fetch(
                `/api/locations?text=${encodeURIComponent(text)}`
            );


        const data =
            await response.json();


        if (
            !data.success ||
            !data.results ||
            !data.results.length
        ) {

            locationSuggestions.innerHTML = `
                <div class="locationSuggestion">
                    No locations found
                </div>
            `;

            return;

        }


        locationSuggestions.innerHTML = "";


        data.results.forEach(
            location => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "locationSuggestion";


                item.innerHTML = `

                    <div class="locationName">
                        ${escapeHtml(
                            location.name
                        )}
                    </div>

                    <div class="locationDetails">
                        ${escapeHtml(
                            location.formatted
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


                locationSuggestions.appendChild(
                    item
                );

            }
        );


    } catch (error) {

        console.error(
            "Location search error:",
            error
        );


        locationSuggestions.innerHTML = `
            <div class="locationSuggestion">
                Unable to search locations
            </div>
        `;

    }

}


// =====================================================
// SELECT LOCATION
// =====================================================

function selectLocation(location) {

    // ---------------------------------------------
    // Place
    // ---------------------------------------------

    placeInput.value =
        location.formatted ||
        location.name;


    // ---------------------------------------------
    // Latitude
    // ---------------------------------------------

    document.getElementById(
        "latitude"
    ).value =
        Number(
            location.latitude
        ).toFixed(6);


    // ---------------------------------------------
    // Longitude
    // ---------------------------------------------

    document.getElementById(
        "longitude"
    ).value =
        Number(
            location.longitude
        ).toFixed(6);


    hideLocationSuggestions();


    console.log(
        "Selected location:",
        location
    );

}


// =====================================================
// HIDE SUGGESTIONS
// =====================================================

function hideLocationSuggestions() {

    locationSuggestions.style.display =
        "none";

    locationSuggestions.innerHTML = "";

}


// =====================================================
// CLOSE WHEN CLICKING OUTSIDE
// =====================================================

document.addEventListener(
    "click",
    function (event) {

        if (
            !event.target.closest(
                ".locationSearch"
            )
        ) {

            hideLocationSuggestions();

        }

    }
);


// =====================================================
// HTML ESCAPE
// =====================================================

function escapeHtml(value) {

    return String(value || "")
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
function displayPlanetDetails(data) {

    const planets = data.planets || [];

    const card =
        document.getElementById("planetDetailsCard");

    if (!planets.length) {

        card.style.display = "none";
        return;

    }

    card.style.display = "block";


    const symbols = {

        Sun: "☉",
        Moon: "☽",
        Mercury: "☿",
        Venus: "♀",
        Mars: "♂",
        Jupiter: "♃",
        Saturn: "♄",
        Rahu: "☊",
        Ketu: "☋"

    };


    // ==========================================
    // PLANET DETAILS
    // ==========================================

    card.innerHTML = `

        <h2>🪐 Planet Details</h2>

        <div class="planetTableWrapper">

            <table class="planetDetailsTable">

                <thead>

                    <tr>

                        <th>Planet</th>
                        <th>Rashi</th>
                        <th>House</th>
                        <th>Degree</th>
                        <th>Nakshatra</th>
                        <th>Nakshatra Lord</th>
                        <th>Sub Lord</th>
                        <th>Sookshma Daipathi</th>
                        <th>Pada</th>
                        <th>Motion</th>
                        <th>Combustion</th>

                    </tr>

                </thead>


                <tbody>

                    ${planets.map(p => {

                        const isRetro =
                            p.retrograde === true;

                        const isCombust =
                            p.combust === true;


                        return `

                            <tr>

                                <!-- Planet -->

                                <td class="planetName">

                                    <span class="planetSymbol">
                                        ${
                                            symbols[p.planet]
                                            || ""
                                        }
                                    </span>

                                    <span>
                                        ${p.planet || "-"}
                                    </span>

                                </td>


                                <!-- Rashi -->

                                <td>
                                    ${p.rashi || "-"}
                                </td>


                                <!-- House -->

                                <td>
                                    ${p.house ?? "-"}
                                </td>


                                <!-- Degree -->

                                <td>
                                    ${p.degree ?? "-"}°
                                </td>


                                <!-- Nakshatra -->

                                <td>
                                    ${p.nakshatra || "-"}
                                </td>


                                <!-- Nakshatra Lord -->

                                <td>
                                    ${p.nakshatraLord || "-"}
                                </td>


                                <!-- Sub Lord -->

                                <td>
                                    ${p.subLord || "-"}
                                </td>


                                <!-- Sookshma Daipathi -->

                                <td>
                                    ${p.sookshmaDaipathi || "-"}
                                </td>


                                <!-- Pada -->

                                <td>
                                    ${p.pada ?? "-"}
                                </td>


                                <!-- Motion -->

                                <td>

                                    <span class="${
                                        isRetro
                                            ? "motionRetro"
                                            : "motionDirect"
                                    }">

                                        ${
                                            isRetro
                                                ? "🔴 Retro"
                                                : "🟢 Direct"
                                        }

                                    </span>

                                </td>


                                <!-- Combustion -->

                                <td>

                                    ${
                                        isCombust

                                            ? `<span class="combustStatus">
                                                🔥 Combust
                                               </span>`

                                            : `<span class="normalStatus">
                                                —
                                               </span>`
                                    }

                                </td>

                            </tr>

                        `;

                    }).join("")}

                </tbody>

            </table>

        </div>

    `;


    // ==========================================
    // LAGNA + MANDHI
    // ==========================================

    const lagna = data.lagna || {};
    const mandhi = data.mandhi || {};


    let lagnaCard =
        document.getElementById(
            "lagnaDetailsCard"
        );


    if (!lagnaCard) {

        lagnaCard =
            document.createElement("div");

        lagnaCard.id =
            "lagnaDetailsCard";

        lagnaCard.className =
            "detailsCard";


        card.parentNode.insertBefore(
            lagnaCard,
            card.nextSibling
        );

    }


    lagnaCard.style.display = "block";


        // lagnaCard.innerHTML = `

        // <h2>♈ Lagna & Mandhi Details</h2>

        // <div class="planetTableWrapper">

        //     <table class="planetDetailsTable">

        //         <thead>

        //             <tr>

        //                 <th>Type</th>
        //                 <th>Rashi</th>
        //                 <th>Degree</th>

        //                 <th>Nakshatra</th>
        //                 <th>Nakshatra Lord</th>
        //                 <th>Sub Lord</th>
        //                 <th>Sookshma Daipathi</th>
        //                 <th>Pada</th>

        //             </tr>

        //         </thead>


        //         <tbody>

        //             <!-- ========================= -->
        //             <!-- LAGNA -->
        //             <!-- ========================= -->

        //             <tr>

        //                 <td class="planetName">
        //                     ♈ Lagna
        //                 </td>

        //                 <td>
        //                     ${lagna.rashi || "-"}
        //                 </td>

        //                 <td>
        //                     ${lagna.degree ?? "-"}°
        //                 </td>

        //                 <td>
        //                     ${lagna.nakshatra || "-"}
        //                 </td>

        //                 <td>
        //                     ${lagna.nakshatraLord || "-"}
        //                 </td>

        //                 <td>
        //                     ${lagna.subLord || "-"}
        //                 </td>

        //                 <td>
        //                     ${lagna.sookshmaDaipathi || "-"}
        //                 </td>

        //                 <td>
        //                     ${lagna.pada ?? "-"}
        //                 </td>

        //             </tr>


        //             <!-- ========================= -->
        //             <!-- MANDHI -->
        //             <!-- ========================= -->

        //             <tr>

        //                 <td class="planetName">
        //                     ⚫ Mandhi
        //                 </td>

        //                 <td>
        //                     ${mandhi.rashi || "-"}
        //                 </td>

        //                 <td>
        //                     ${mandhi.degree ?? "-"}°
        //                 </td>

        //                 <td>
        //                     ${mandhi.nakshatra || "-"}
        //                 </td>

        //                 <td>
        //                     ${mandhi.nakshatraLord || "-"}
        //                 </td>

        //                 <td>
        //                     ${mandhi.subLord || "-"}
        //                 </td>

        //                 <td>
        //                     ${mandhi.sookshmaDaipathi || "-"}
        //                 </td>

        //                 <td>
        //                     ${mandhi.pada ?? "-"}
        //                 </td>

        //             </tr>

        //         </tbody>

        //     </table>

        // </div>

    //`;

}
