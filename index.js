const express = require("express");
const path = require("path");

const astrology = require("./services/astrology");

const app = express();


// =====================================================
// Middleware
// =====================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// =====================================================
// Static files
// index.html
// script.js
// style.css
// etc.
// =====================================================

app.use(express.static(path.join(__dirname, "public")));


// =====================================================
// Home Page
// =====================================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname,'public', "index.html")
    );

});


// =====================================================
// Kundali API
// =====================================================

app.post("/api/kundali", async (req, res) => {

    try {

        console.log("Kundali request received:");

        console.log(req.body);


        const data = req.body;


        // ---------------------------------------------
        // Validation
        // ---------------------------------------------

        if (!data.date) {

            return res.status(400).json({
                success: false,
                message: "Date is required"
            });

        }


        if (!data.time) {

            return res.status(400).json({
                success: false,
                message: "Time is required"
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
        // Default timezone
        // India = UTC + 5:30
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
            await astrology.generate(data);


        // ---------------------------------------------
        // Send response
        // ---------------------------------------------

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

});


// =====================================================
// Render PORT
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
