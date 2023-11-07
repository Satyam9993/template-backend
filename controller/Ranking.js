import ErrorHandler from "../utils/errorHandler.js";
import RankingSchemaModel from "../model/HotelRanking.js";

// create order
const getHotelRankingData = async (req, res, next) => {
    try {

        // const { hotelId, startDate } = req.query;
        let startDate = new Date()
        console.log(startDate,"startDatestartDatestartDatestartDate")
        // let previousDate = 
        let hotelId = req.query.hotelId


        if (!startDate) {
            return next(new ErrorHandler("Please provide a start date", 400));
        }

        // let pipeline = []
        // const parsedDate_start = parse(startDate, 'dd-MM-yyyy', new Date());
        // const formattedDate_start = format(parsedDate_start, 'yyyy-MM-dd');
        // const previousDate = addDays(parsedDate_start, -1);
        // const formattedPreviousDate = format(previousDate, 'yyyy-MM-dd');

        pipeline.push({
            $match: {
                timestamp: {
                    $in: [formattedDate_start, formattedPreviousDate]
                }
            }
        });


        pipeline.push({
            $unwind: "$ranking"
        }, {
            $match: {
                "ranking.rank": 390
            }
        });

        pipeline.push({
            $group: {
                _id: "$otaId",
                ranks : {$push: "$ranking.rank"},
                timestamp : {$push: "$timestamp"},
            }
        });

        const data = await RankingSchemaModel.aggregate(pipeline);

        res.status(200).json({
            success: true,
            data
        })

    } catch (error) {
        console.log(error.message);
        return next(new ErrorHandler(error.message, 500));
    }
};

export { getHotelRankingData };