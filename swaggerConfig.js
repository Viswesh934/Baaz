
const swaggerJSDoc = require('swagger-jsdoc');
require('dotenv').config();

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'My API',
    version: '1.0.0',
    description: 'A sample API documentation with Swagger',
  },
  servers: [
    {
      url: process.env.BASE_URL, 
    },
  ],
};


const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], 
};


const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
