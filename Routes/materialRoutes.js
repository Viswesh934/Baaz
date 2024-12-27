const {getMaterials,postMaterials,updateMaterials,deleteMaterials}= require('../controllers/materialController');

const Router = require('express').Router();

Router.get('/getMaterials',getMaterials);
Router.post('/postMaterials',postMaterials);
Router.put('/updateMaterials/:id',updateMaterials);
Router.delete('/deleteMaterials/:id',deleteMaterials);

module.exports=Router;