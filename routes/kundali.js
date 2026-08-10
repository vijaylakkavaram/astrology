const express = require("express");
const router = express.Router();

const astrology = require("../services/astrology");

router.post("/", async (req, res) => {

    try {

        const result = await astrology.generate(req.body);

        res.json(result);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

module.exports = router;