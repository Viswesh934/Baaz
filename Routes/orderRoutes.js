const {createOrder,updateOrder,getOrders,deleteOrder}=require('../controllers/orderController');

const Router = require('express').Router();

Router.post('/createOrder',createOrder);
Router.put('/updateOrder/:id',updateOrder);
Router.get('/getOrders',getOrders);
Router.delete('/deleteOrder/:id',deleteOrder);

module.exports=Router;