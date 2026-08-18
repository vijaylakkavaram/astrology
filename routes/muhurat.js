const express = require("express");

const {
    calculateMuhurat,
    findMuhurats
} = require("../services/muhurat");

const router = express.Router();


// ============================================================
// Calculate Muhurat for one date
// ============================================================

router.post("/", async (req, res) => {

    try {

        const {
            date,
            latitude,
            longitude,
            timezone,
            type
        } = req.body;


        const result =
            await calculateMuhurat({
                date,
                latitude: Number(latitude),
                longitude: Number(longitude),
                timezone:
                    timezone || "Asia/Kolkata",
                type:
                    type || "general"
            });


        res.json(result);

    } catch (error) {

        console.error(error);

        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});


// ============================================================
// Find Muhurats in date range
// ============================================================

router.post("/find", async (req, res) => {

    try {

        const {
            startDate,
            days,
            latitude,
            longitude,
            timezone,
            type
        } = req.body;


        const result =
            await findMuhurats({
                startDate,
                days:
                    Number(days || 30),
                latitude:
                    Number(latitude),
                longitude:
                    Number(longitude),
                timezone:
                    timezone || "Asia/Kolkata",
                type:
                    type || "marriage"
            });


        res.json(result);

    } catch (error) {

        console.error(error);

        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});


module.exports = router;
