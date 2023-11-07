const mongoose = require("mongoose");
require("dotenv").config();

const db_uri = process.env.DB_URI || '';

exports.connectDB = async () => {
    try{
        await mongoose.connect(db_uri).then((data)=>{
            console.log(`Database connected successfully`);
        })
    }catch(error){
        console.log(error.message);
        setTimeout(connectDB, 5000);
    }
}