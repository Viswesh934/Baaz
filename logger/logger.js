const devLogger= require('./devlogger');
const prodLogger= require('./prodlogger');
require('dotenv').config();

let logger=null;

if (process.env.NODE_ENV === 'development') {
    logger=devLogger();
}
else {
    logger=prodLogger();
}

module.exports=logger;
