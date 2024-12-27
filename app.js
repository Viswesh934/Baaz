require('dotenv').config();
const express=require('express');
const db=require('./db/db');
const app=express();
const port=process.env.PORT || 3000;
const orderRoutes=require('./Routes/orderRoutes');
const materialRoutes=require('./Routes/materialRoutes');
const reportingRoutes=require('./Routes/reportingRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');
const ratelimit= require('express-rate-limit');

const limiter = ratelimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'You are sending too many requests mate',
    headers: true,
    legacy: true
  });

app.use(limiter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use('/order',orderRoutes);
app.use('/material',materialRoutes);
app.use('/report',reportingRoutes);



app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})

