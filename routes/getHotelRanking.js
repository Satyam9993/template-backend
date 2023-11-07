const express = require("express");
const router = express.Router();
const { getHotelRankingData } = require("../controller/Ranking");

router.get('/hotel-rank', getHotelRankingData);

module.exports = router;