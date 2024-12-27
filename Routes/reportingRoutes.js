const Router = require('express').Router();

const {stockReport,priceFluctuation}= require('../controllers/reportingController');

Router.get('/generateStockReport',stockReport);
Router.get('/calculatePriceFluctuation',priceFluctuation);

module.exports=Router;