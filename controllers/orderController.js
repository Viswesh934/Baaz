const orders= require('../models/orders');
const logger=require('../logger/logger');
const materials=require('../models/materials');

function discount(quantity,price){
    if(quantity>100){
        logger.info('10% discount applied');
        return price*0.9; //10% discount

    }
    else if(quantity>50){
        logger.info('5% discount applied');
        return price*0.95; //5% discount
    }
    else{
        return price;
    }}

//controller to create order

const createOrder = async (req, res) => {
    try {
        const { customerName, items } = req.body;
        let totalPrice = 0;
        for (const item of items) {
            // Fetch material by ID
            const material = await materials.findById(item.materialId);
            if (!material) {
                res.status(404).send('Material not found');
                logger.error('Material not found');
                return;
            }

            // Check if sufficient stock is available
            if (material.stock < item.quantity) {
                res.status(400).send('Quantity not available');
                logger.error('Quantity not available');
                return;
            }

            // Calculate price for the item
            const price = material.basePrice * item.quantity;

            if (isNaN(price) || price <= 0) {
                res.status(400).send('Invalid price calculation');
                logger.error('Invalid price calculation');
                return;
            }

            // Apply discount
            const discountedPrice = discount(item.quantity, price);
            totalPrice += discountedPrice;

            // Update material stock
            material.stock -= item.quantity;
            await material.save();

            // Add price to the item
            item.price = discountedPrice;
        }

        // Create and save the order
        const order = new orders({
            customerName,
            items,
            totalPrice,
            status: 'Pending'
        });

        await order.save();
        logger.info('Order created successfully');
        res.status(200).send(order);
    } catch (error) {
        console.log(error);
        logger.error('Error in creating order');
        res.status(500).send('Error in creating order');
    }
};


//controller for updating order status

const updateOrder= async(req,res)=>{
    try{
        const status=['Pending', 'Processed', 'Completed', 'Cancelled'];
        
        
        if(!status.includes(req.body.status)){
            res.status(400).send('Invalid status');
            logger.error('Invalid status');
        }
        const order = await orders.findByIdAndUpdate(
            req.params.id, 
            { status: req.body.status }, 
            { new: true }
        );
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
        res.send(data);
        res.status(200);
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
        const existingOrder=await orders.findById(req.params.id);
        if(!existingOrder){
            res.status(404).send('Order not found');
            logger.error('Order not found');
        }
        const order=await orders.findByIdAndDelete(req.params.id);
        for(const item of existingOrder.items){
            const material= await materials.findById(item.materialId);
            material.stock+=item.quantity;
            await material.save();
        }
        logger.info('Order deleted successfully');
        res.send(order);
    }
    catch(error){
        logger.error('Error in deleting order');
        res.status(500).send
    }
}





module.exports={createOrder,updateOrder,getOrders,deleteOrder};