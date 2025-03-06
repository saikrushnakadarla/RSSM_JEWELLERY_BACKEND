const express = require("express");
const router = express.Router();
const RateController = require("../controllers/rateController");

// ✅ Fix route paths to match frontend
router.post("/post/rates", RateController.postRates);
router.get("/get/current-rates", RateController.getCurrentRates);

module.exports = router;
