const mongoose = require('mongoose');

const rankingSchema = new mongoose.Schema({
  rank: Number,
  name: String,
  hotelID: Number,
  starCategory: Number,
  userRating: Number,
  numberOfRatings: Number,
  discountedPrice: Number
});

const RankingSchema = new mongoose.Schema({
  timestamp: Date,
  otaId: Number,
  ranking: [rankingSchema],
  cityId: Number
});

const RankingSchemaModel = mongoose.model('rankings', RankingSchema);

module.exports = RankingSchemaModel;
