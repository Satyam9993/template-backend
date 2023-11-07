const { CatchAsync } = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const RankingSchemaModel = require("../model/HotelRanking");
const { parse, format, subDays, addDays } = require('date-fns');


// create order
exports.getHotelRankingData = CatchAsync(async (req, res, next) => {
    try {

        const { hotelId, startDate } = req.query;

        if (!startDate) {
            return next(new ErrorHandler("Please provide a start date", 400));
        }

        // if(!hotelId){
        //     return next(new ErrorHandler("Please provide a hotel id", 400));
        // }

        let pipeline = []
        const parsedDate_start = parse(startDate, 'dd-MM-yyyy', new Date());
        const formattedDate_start = format(parsedDate_start, 'yyyy-MM-dd');
        const previousDate = addDays(parsedDate_start, -1);
        const formattedPreviousDate = format(previousDate, 'yyyy-MM-dd');

        pipeline.push({
            $match: {
                timestamp: {
                    $in: [formattedDate_start, formattedPreviousDate]
                }
            }
        });
        // let low = hotelId & 0xFFFFFFFF;
        // let high = hotelId / 0x100000000;

        pipeline.push({
            $unwind: "$ranking"
        }, {
            $match: {
                "ranking.rank": 390
            }
        });

        // pipeline.push({
        //     $unwind: "$ranking"
        // }, {
        //     $match: {
        //         "ranking.ranking.hotelID.low": low,
        //         "ranking.ranking.hotelID.high": Math.floor(high),
        //     }
        // });

        pipeline.push({
            $group: {
                _id: "$otaId",
                ranks : {$push: "$ranking.rank"},
                timestamp : {$push: "$timestamp"},
            }
        });

        const data = await RankingSchemaModel.aggregate(pipeline);
        // const data = await RankingSchemaModel.find();

        res.status(200).json({
            success: true,
            data
        })

    } catch (error) {
        console.log(error.message);
        return next(new ErrorHandler(error.message, 500));
    }
});