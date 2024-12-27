const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI, {});
if(mongoose.connection.readyState){
    console.log("Connected to database");
}
else{
    console.log("Error connecting to database");
}