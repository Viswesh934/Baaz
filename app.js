require('dotenv').config();
const express=require('express');
const db=require('./db/db');
const app=express();
const port=process.env.PORT || 3000;
const orderRoutes=require('./routes/orderRoutes');
const materialRoutes=require('./routes/materialRoutes');
const reportingRoutes=require('./routes/reportingRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use('/order',orderRoutes);
app.use('/material',materialRoutes);
app.use('/report',reportingRoutes);



app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})

