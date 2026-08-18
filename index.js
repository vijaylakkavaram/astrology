require("dotenv").config();

const express = require("express");
const path = require("path");

const astrology = require("./services/astrology");

const app = express();


// =====================================================
// Middleware
// =====================================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// =====================================================
// Static frontend
// =====================================================

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


// =====================================================
// Home
// =====================================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "dashboard.html"
        )
    );

});


// =====================================================
// LOCATION AUTOCOMPLETE
// =====================================================

app.get("/api/locations", async (req, res) => {
console.log(process.env.GEOAPIFY_API_KEY);

    try {

        const text =
            String(
                req.query.text || ""
            ).trim();


        // Don't search for very short text
        if (text.length < 2) {

            return res.json({
                results: []
            });

        }


        const apiKey =
            process.env.GEOAPIFY_API_KEY;


        if (!apiKey) {

            console.error(
                "GEOAPIFY_API_KEY is not configured"
            );


            return res.status(500).json({

                success: false,

                message:
                    "Geoapify API key is not configured"

            });

        }


        // -------------------------------------------------
        // India only
        // -------------------------------------------------

        const url =
            new URL(
                "https://api.geoapify.com/v1/geocode/autocomplete"
            );


        url.searchParams.set(
            "text",
            text
        );


        url.searchParams.set(
            "type",
            "city"
        );


        url.searchParams.set(
            "filter",
            "countrycode:in"
        );


        url.searchParams.set(
            "limit",
            "8"
        );


        url.searchParams.set(
            "format",
            "json"
        );


        url.searchParams.set(
            "apiKey",
            apiKey
        );


        const response =
            await fetch(url);


        if (!response.ok) {

            const errorText =
                await response.text();


            console.error(
                "Geoapify error:",
                errorText
            );


            return res.status(
                response.status
            ).json({

                success: false,

                message:
                    "Location search failed"

            });

        }


        const data =
            await response.json();


        // -------------------------------------------------
        // Convert Geoapify response
        // into our own simple format
        // -------------------------------------------------

        const results =
            (data.results || [])
                .map(location => ({

                    name:
                        location.name ||
                        location.city ||
                        location.formatted,

                    formatted:
                        location.formatted,

                    city:
                        location.city || "",

                    state:
                        location.state || "",

                    country:
                        location.country || "",

                    latitude:
                        Number(
                            location.lat
                        ),

                    longitude:
                        Number(
                            location.lon
                        ),

                    placeId:
                        location.place_id || ""

                }));


        res.json({

            success: true,

            results

        });


    } catch (error) {

        console.error(
            "Location API error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to search location"

        });

    }

});


// =====================================================
// KUNDALI API
// =====================================================

app.post(
    "/api/kundali",
    async (req, res) => {

        try {

            console.log(
                "Kundali request:",
                req.body
            );


            const data =
                req.body;


            // ---------------------------------------------
            // Validation
            // ---------------------------------------------

            if (!data.date) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Date is required"

                });

            }


            if (!data.time) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Time is required"

                });

            }


            if (
                data.latitude === undefined ||
                data.longitude === undefined
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Latitude and longitude are required"

                });

            }


            // ---------------------------------------------
            // India timezone
            // ---------------------------------------------

            if (
                data.timezone === undefined ||
                data.timezone === null
            ) {

                data.timezone = 5.5;

            }


            // ---------------------------------------------
            // Generate Kundali
            // ---------------------------------------------

            const result =
                await astrology.generate(
                    data
                );


            res.json(result);


        } catch (error) {

            console.error(
                "Kundali API Error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    error.message ||
                    "Kundali calculation failed"

            });

        }

    }
);
const muhuratRoutes = require("../horoscope/routes/muhurat");

app.use(
    "/api/muhurat",
    muhuratRoutes
);

app.get("/dashboard", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "dashboard.html")
    );
});


// =====================================================
// RENDER PORT
// =====================================================

const PORT =
    process.env.PORT || 10000;


app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `Kundali server running on port ${PORT}`
        );

    }
);