const materials= require('../models/materials');
const logger= require('../logger/logger');

//controller to get materials

const getMaterials= async(req,res)=>{
    try{
        const data=await materials.find();
        logger.info('Materials fetched successfully');
        res.status(200).send(data);
    }
    catch(error){
        logger.error('Error in fetching materials');
        res.status(500).send
    }
}

//controller to add materials

const postMaterials= async(req,res)=>{
    try{
        const data=new materials(req.body);
        await data.save();
        logger.info('Material added successfully');
        res.status(200).send(data);
    }
    catch(error){
        logger.error('Error in adding material');
        res.status(500).send
    }
}

//controller to update materials

const updateMaterials= async(req,res)=>{
    try{
        const data=await materials.findByIdAndUpdate(req.params.id,req.body);
        await data.save();
        logger.info('Material updated successfully');
        res.status(200).send(data);
    }
    catch(error){
        logger.error('Error in updating material');
        res.status(500).send
    }}

//controller to delete materials

const deleteMaterials= async(req,res)=>{
    try{
        const data=await materials.findByIdAndDelete(req.params.id);
        if(!data){
            res.status(404).send('Material not found');
        }
        logger.info('Material deleted successfully');
        res.status(200).send(data);
    }
    catch(error){
        logger.error('Error in deleting material');
        res.status(500).send
    }
}

module.exports={getMaterials,postMaterials,updateMaterials,deleteMaterials}