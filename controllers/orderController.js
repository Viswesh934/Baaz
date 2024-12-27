const orders= require('../models/orders');
const logger=require('../logger/logger');
const materials=require('../models/materials');

function discount(quantity,price){
    if(quantity>100){
        return price*0.9; //10% discount
    }
    else if(quantity>50){
        return price*0.95; //5% discount
    }
    else{
        return price;
    }}

//controller to create order

const createOrder= async(req,res)=>{
    try{
        const { customerName, items } = req.body;
        let totalPrice = 0;
        for (const item of items) {
            const material=materials.findById(item.materialId);
            if(!material){
                res.status(404).send('Material not found');
                logger.error('Material not found');
            }
            if(material.quantity<item.quantity){
                res.status(400).send('Quantity not available');
                logger.error('Quantity not available');
            }

            const price=material.baseprice*item.quantity;
            totalPrice+=discount(quantity,price);
            //update material quantity
            material.stock-=item.quantity;
            await material.save();
        }
        const order=new orders({
            customerName,
            items,
            totalPrice,
            status:'Pending'
        });
        await order.save();
        logger.info('Order created successfully');
        res.status(200).send(order);
    }
    catch(error){
        logger.error('Error in creating order');
        res.status(500).send
    }
}

//controller for updating order status

const updateOrder= async(req,res)=>{
    try{
        const status=['Pending', 'Processed', 'Completed', 'Cancelled'];
        
        if(!status.includes(req.body.status)){
            res.status(400).send('Invalid status');
            logger.error('Invalid status');
        }
        const order = await orders.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if(!order){
            res.status(404).send('Order not found');
            logger.error('Order not found');
        }
        logger.info('Order updated successfully');
        res.status(200).send(order);
    }
    catch(error){
        logger.error('Error in updating order');
        res.status(500).send
    }
}

//controller to get orders

const getOrders= async(req,res)=>{
    try{
        const data=await orders.find();
        logger.info('Orders fetched successfully');
    }
    catch(error){
        logger.error('Error in fetching orders');
        res.status(500).send
    }
}

//controller to delete order and update material stock
const deleteOrder= async(req,res)=>{
    try{
        const order=await orders.findByIdAndDelete(req.params.id);
        if(!order){
            res.status(404).send('Order not found');
            logger.error('Order not found');
        }
        for(const item of order.items){
            const material=materials.findById(item.materialId);
            material.stock+=item.quantity;
            await material.save();
        }
        logger.info('Order deleted successfully');
    }
    catch(error){
        logger.error('Error in deleting order');
        res.status(500).send
    }
}





module.exports={createOrder,updateOrder,getOrders,deleteOrder};