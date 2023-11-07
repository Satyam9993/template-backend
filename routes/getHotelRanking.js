import express from 'express'
import {getHotelRankingData} from "../controller/Ranking.js"
const router = express.Router();

router.get('/hotel-rank', getHotelRankingData);

export default router