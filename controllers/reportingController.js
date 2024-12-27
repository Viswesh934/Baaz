const materials= require('../models/materials');

const logger=require('../logger/logger');


//controller to generate stock report

const stockReport= async(req,res)=>{
    try{
        const data=await materials.find();
        const report=data.map(material=>{
            return {
                name:material.name,
                stock:material.stock
            }
        });
        logger.info('Stock report generated successfully');
        res.status(200).send(report);
    }
    catch(error){
        logger.error('Error in generating stock report');
        res.status(500).send("Error in generating stock report")
    }
}

//controller to calulate price fluctuation

const priceFluctuation= async(req,res)=>{
    try{
        const data=await materials.find();
        const report=data.map(material=>{
            const priceHistory=material.priceHistory;
            
            return {
                priceHistory:priceHistory
            }
        });
        logger.info('Price fluctuation calculated successfully');
        res.status(200).send(report);
    }
    catch(error){
        logger.error('Error in calculating price fluctuation');
        res.status(500).send("Error in calculating price fluctuation")
    }
}


module.exports={stockReport,priceFluctuation}