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

const indiaLocations = {

    // =========================
    // Andhra Pradesh
    // =========================

    "Visakhapatnam": [17.6868, 83.2185],
    "Vijayawada": [16.5062, 80.6480],
    "Tirupati": [13.6288, 79.4192],
    "Guntur": [16.3067, 80.4365],
    "Nellore": [14.4426, 79.9865],
    "Kurnool": [15.8281, 78.0373],
    "Rajahmundry": [17.0005, 81.8040],
    "Kakinada": [16.9891, 82.2475],
    "Anantapur": [14.6819, 77.6006],
    "Kadapa": [14.4674, 78.8241],
    "Eluru": [16.7107, 81.0952],
    "Ongole": [15.5057, 80.0499],
    "Srikakulam": [18.2969, 83.8968],
    "Machilipatnam": [16.1875, 81.1389],

    // =========================
    // Telangana
    // =========================

    "Hyderabad": [17.3850, 78.4867],
    "Warangal": [17.9784, 79.5941],
    "Nizamabad": [18.6725, 78.0941],
    "Karimnagar": [18.4386, 79.1288],
    "Khammam": [17.2473, 80.1514],
    "Ramagundam": [18.8000, 79.4500],
    "Mahbubnagar": [16.7488, 77.9850],
    "Nalgonda": [17.0575, 79.2684],
    "Adilabad": [19.6641, 78.5320],

    // =========================
    // Karnataka
    // =========================

    "Bengaluru": [12.9716, 77.5946],
    "Mysuru": [12.2958, 76.6394],
    "Mangaluru": [12.9141, 74.8560],
    "Hubballi": [15.3647, 75.1240],
    "Dharwad": [15.4589, 75.0078],
    "Belagavi": [15.8497, 74.4977],
    "Kalaburagi": [17.3297, 76.8343],
    "Davangere": [14.4644, 75.9218],
    "Ballari": [15.1394, 76.9214],
    "Shivamogga": [13.9299, 75.5681],
    "Tumakuru": [13.3379, 77.1173],
    "Udupi": [13.3409, 74.7421],
    "Hassan": [13.0033, 76.1004],
    "Mandya": [12.5218, 76.8951],
    "Chitradurga": [14.2306, 76.3980],
    "Raichur": [16.2120, 77.3439],
    "Vijayapura": [16.8302, 75.7100],
    "Kolar": [13.1367, 78.1290],

    // =========================
    // Tamil Nadu
    // =========================

    "Chennai": [13.0827, 80.2707],
    "Coimbatore": [11.0168, 76.9558],
    "Madurai": [9.9252, 78.1198],
    "Tiruchirappalli": [10.7905, 78.7047],
    "Salem": [11.6643, 78.1460],
    "Tirunelveli": [8.7139, 77.7567],
    "Erode": [11.3410, 77.7172],
    "Vellore": [12.9165, 79.1325],
    "Thoothukudi": [8.7642, 78.1348],
    "Dindigul": [10.3673, 77.9803],
    "Thanjavur": [10.7870, 79.1378],
    "Tiruppur": [11.1085, 77.3411],
    "Hosur": [12.7409, 77.8253],
    "Kanchipuram": [12.8342, 79.7036],
    "Rameswaram": [9.2876, 79.3129],
    "Kanyakumari": [8.0883, 77.5385],

    // =========================
    // Kerala
    // =========================

    "Thiruvananthapuram": [8.5241, 76.9366],
    "Kochi": [9.9312, 76.2673],
    "Kozhikode": [11.2588, 75.7804],
    "Thrissur": [10.5276, 76.2144],
    "Kollam": [8.8932, 76.6141],
    "Kannur": [11.8745, 75.3704],
    "Alappuzha": [9.4981, 76.3388],
    "Palakkad": [10.7867, 76.6548],
    "Kottayam": [9.5916, 76.5222],

    // =========================
    // Maharashtra
    // =========================

    "Mumbai": [19.0760, 72.8777],
    "Pune": [18.5204, 73.8567],
    "Nagpur": [21.1458, 79.0882],
    "Nashik": [19.9975, 73.7898],
    "Aurangabad": [19.8762, 75.3433],
    "Kolhapur": [16.7050, 74.2433],
    "Solapur": [17.6599, 75.9064],
    "Amravati": [20.9374, 77.7796],
    "Nanded": [19.1383, 77.3210],
    "Akola": [20.7002, 77.0082],
    "Satara": [17.6805, 74.0183],
    "Latur": [18.4088, 76.5604],
    "Jalgaon": [21.0077, 75.5626],
    "Thane": [19.2183, 72.9781],

    // =========================
    // Gujarat
    // =========================

    "Ahmedabad": [23.0225, 72.5714],
    "Surat": [21.1702, 72.8311],
    "Vadodara": [22.3072, 73.1812],
    "Rajkot": [22.3039, 70.8022],
    "Bhavnagar": [21.7645, 72.1519],
    "Jamnagar": [22.4707, 70.0577],
    "Gandhinagar": [23.2156, 72.6369],
    "Anand": [22.5645, 72.9289],
    "Bhuj": [23.2420, 69.6669],

    // =========================
    // Rajasthan
    // =========================

    "Jaipur": [26.9124, 75.7873],
    "Jodhpur": [26.2389, 73.0243],
    "Udaipur": [24.5854, 73.7125],
    "Kota": [25.2138, 75.8648],
    "Ajmer": [26.4499, 74.6399],
    "Bikaner": [28.0229, 73.3119],
    "Alwar": [27.5530, 76.6346],

    // =========================
    // Delhi
    // =========================

    "New Delhi": [28.6139, 77.2090],
    "Delhi": [28.7041, 77.1025],

    // =========================
    // Uttar Pradesh
    // =========================

    "Lucknow": [26.8467, 80.9462],
    "Kanpur": [26.4499, 80.3319],
    "Agra": [27.1767, 78.0081],
    "Varanasi": [25.3176, 82.9739],
    "Prayagraj": [25.4358, 81.8463],
    "Meerut": [28.9845, 77.7064],
    "Ghaziabad": [28.6692, 77.4538],
    "Noida": [28.5355, 77.3910],
    "Mathura": [27.4924, 77.6737],
    "Ayodhya": [26.7990, 82.2047],
    "Gorakhpur": [26.7606, 83.3732],

    // =========================
    // West Bengal
    // =========================

    "Kolkata": [22.5726, 88.3639],
    "Howrah": [22.5958, 88.2636],
    "Durgapur": [23.5204, 87.3119],
    "Siliguri": [26.7271, 88.3953],

    // =========================
    // Odisha
    // =========================

    "Bhubaneswar": [20.2961, 85.8245],
    "Cuttack": [20.4625, 85.8828],
    "Rourkela": [22.2604, 84.8536],
    "Puri": [19.8135, 85.8312],
    "Sambalpur": [21.4669, 83.9812],

    // =========================
    // Bihar
    // =========================

    "Patna": [25.5941, 85.1376],
    "Gaya": [24.7914, 85.0002],
    "Muzaffarpur": [26.1209, 85.3647],
    "Bhagalpur": [25.2425, 86.9842],

    // =========================
    // Jharkhand
    // =========================

    "Ranchi": [23.3441, 85.3096],
    "Jamshedpur": [22.8046, 86.2029],
    "Dhanbad": [23.7957, 86.4304],
    "Bokaro": [23.6693, 86.1511],

    // =========================
    // Madhya Pradesh
    // =========================

    "Bhopal": [23.2599, 77.4126],
    "Indore": [22.7196, 75.8577],
    "Gwalior": [26.2183, 78.1828],
    "Jabalpur": [23.1815, 79.9864],
    "Ujjain": [23.1765, 75.7885],
    "Sagar": [23.8388, 78.7378],

    // =========================
    // Chhattisgarh
    // =========================

    "Raipur": [21.2514, 81.6296],
    "Bhilai": [21.1938, 81.3509],
    "Bilaspur": [22.0797, 82.1409],

    // =========================
    // Punjab
    // =========================

    "Chandigarh": [30.7333, 76.7794],
    "Ludhiana": [30.9010, 75.8573],
    "Amritsar": [31.6340, 74.8723],
    "Jalandhar": [31.3260, 75.5762],
    "Patiala": [30.3398, 76.3869],
    "Bathinda": [30.2110, 74.9455],

    // =========================
    // Haryana
    // =========================

    "Gurugram": [28.4595, 77.0266],
    "Faridabad": [28.4089, 77.3178],
    "Panipat": [29.3909, 76.9635],
    "Ambala": [30.3782, 76.7767],
    "Hisar": [29.1492, 75.7217],

    // =========================
    // Uttarakhand
    // =========================

    "Dehradun": [30.3165, 78.0322],
    "Haridwar": [29.9457, 78.1642],
    "Rishikesh": [30.0869, 78.2676],
    "Nainital": [29.3919, 79.4542],

    // =========================
    // Himachal Pradesh
    // =========================

    "Shimla": [31.1048, 77.1734],
    "Dharamshala": [32.2190, 76.3234],
    "Manali": [32.2396, 77.1887],

    // =========================
    // Jammu & Kashmir
    // =========================

    "Srinagar": [34.0837, 74.7973],
    "Jammu": [32.7266, 74.8570],

    // =========================
    // Goa
    // =========================

    "Panaji": [15.4909, 73.8278],
    "Vasco da Gama": [15.3982, 73.8113],

    // =========================
    // Assam
    // =========================

    "Guwahati": [26.1445, 91.7362],
    "Dibrugarh": [27.4728, 94.9120],
    "Silchar": [24.8333, 92.7789],

    // =========================
    // Sikkim
    // =========================

    "Gangtok": [27.3389, 88.6065],

    // =========================
    // Meghalaya
    // =========================

    "Shillong": [25.5788, 91.8933],

    // =========================
    // Manipur
    // =========================

    "Imphal": [24.8170, 93.9368],

    // =========================
    // Tripura
    // =========================

    "Agartala": [23.8315, 91.2868],

    // =========================
    // Mizoram
    // =========================

    "Aizawl": [23.7271, 92.7176],

    // =========================
    // Nagaland
    // =========================

    "Kohima": [25.6751, 94.1086],

    // =========================
    // Arunachal Pradesh
    // =========================

    "Itanagar": [27.0844, 93.6053],

    // =========================
    // Meghalaya
    // =========================

    "Tura": [25.5146, 90.2035],

    // =========================
    // Andaman & Nicobar
    // =========================

    "Port Blair": [11.6234, 92.7265]

};

document
    .getElementById("place")
    .addEventListener("change", function () {

        const place = this.value.trim();

        const location = indiaLocations[place];

        if (!location) {
            return;
        }

        document.getElementById("latitude").value =
            location[0].toFixed(6);

        document.getElementById("longitude").value =
            location[1].toFixed(6);

    });
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


    card.innerHTML = `

        <h2>🪐 Planet Details</h2>

        <div class="tableWrapper">

            <table>

                <thead>

                    <tr>

                        <th>Planet</th>
                        <th>Rashi</th>
                        <th>House</th>
                        <th>Degree</th>
                        <th>Nakshatra</th>
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

                                <td>

                                    ${
                                        symbols[p.planet]
                                        || ""
                                    }

                                    ${p.planet}

                                </td>


                                <td>
                                    ${p.rashi || "-"}
                                </td>


                                <td>
                                    ${p.house || "-"}
                                </td>


                                <td>
                                    ${p.degree ?? "-"}°
                                </td>


                                <td>
                                    ${p.nakshatra || "-"}
                                </td>


                                <td>
                                    ${p.pada || "-"}
                                </td>


                                <td class="${
                                    isRetro
                                        ? "retrograde"
                                        : "direct"
                                }">

                                    ${
                                        isRetro
                                            ? "🔴 Retro"
                                            : "🟢 Direct"
                                    }

                                </td>


                                <td class="${
                                    isCombust
                                        ? "combust"
                                        : ""
                                }">

                                    ${
                                        isCombust
                                            ? "🔥 Combust"
                                            : "—"
                                    }

                                </td>

                            </tr>

                        `;

                    }).join("")}

                </tbody>

            </table>

        </div>

    `;
}
