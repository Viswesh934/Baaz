# Baaz
RESTful API service that manages construction materials inventory, pricing, and order processing.

# Set-up instructions

1.Clone the repository:

``` 
git clone https://github.com/Viswesh934/Baaz.git
 ```

2.Install dependencies:

``` 
npm install
 ```

3.Setup env:
```
PORT=
NODE_ENV=development || production
MONGO_URI=
BaseURL=

```

4.Run the application:

```
node app.js
```

# API documentation:

After running the application you can find the swagger documentation at the endpoint <url>/api-docs

- Materials:
  
  1.GET /material/getMaterials: To fetch details of the materials
  
  2.POST /material/postMaterials: To create the materials
  
  3.PUT /material/updateMaterials/:id: To modify the materials
  
  4.DELETE /material/deleteMaterials/:id: To delete the materials
  
- Orders:
  
  1.GET /order/getOrders: To Get the orders details
  
  2.POST /order/createOrder: To create orders and update inventory
  
  3.PUT /order/updateOrder/:id: To modify orders status
  
  4.Delete /order/deleteOrder/:id: To delete the orders
- Reporting:
  
  1.GET /report/generateStockReport: To get the stockreport
  
  2.GET /report/calculatePriceFluctuation: To get the price fluctuations


# Architecture decisions:

Directory structure:

└── Viswesh934-Baaz/

    ├── controllers/
    │   ├── orderController.js
    │   ├── materialController.js
    │   └── reportingController.js
    ├── swaggerConfig.js
    ├── package.json
    ├── models/
    │   ├── materials.js
    │   └── orders.js
    ├── DockerFile
    ├── Routes/
    │   ├── reportingRoutes.js
    │   ├── materialRoutes.js
    │   └── orderRoutes.js
    ├── __tests__/
    │   ├── reportController.test.js
    │   ├── orderController.test.js
    │   └── materialController.test.js
    ├── app.js
    ├── README.md
    ├── logger/
    │   ├── prodlogger.js
    │   ├── logger.js
    │   └── devlogger.js
    └── db/
        └── db.js

# Testing strategy:

- Test Environment: Use Jest for unit tests with supertest to test the HTTP API routes.
- Mocking: Mock external dependencies like the database (materials model, orders model) and logging utilities (logger).
- Test Coverage: Ensure that each route and controller has appropriate coverage for both happy path and edge cases (errors and invalid inputs).
- Test Scenarios:
  
  1.Success Cases: Test valid requests and responses (correct data, valid statuses, etc.).
  
  2.Failure Cases: Test scenarios such as invalid data, missing resources, or database failures.
- Validation:
```
    npm test 
```
# DataBase schema design:

## Material Schema
The Material schema represents individual materials in the inventory. Each material has several attributes like name, category, unit, base price, stock, and a history of price fluctuations over time.

- Schema Design:

name (String): The name of the material (required).

category (String): The category or type of material (required).

unit (String): The unit of measurement for the material (required).

basePrice (Number): The base price of the material (required).

stock (Number): The quantity of the material available in stock (required).

priceHistory (Array of Objects):

version (String): The version of the price (e.g., 'v1.0', 'v1.1', etc.).

price (Number): The price of the material at that version (required).

date (Date): The date when the price change occurred (defaults to the current date).

timestamps: Automatically adds createdAt and updatedAt fields.

## Order Schema:

The Order schema represents customer orders. Each order contains a list of items (each referencing a material), total price, and the status of the order.

- Schema Design:

customerName (String): The name of the customer who placed the order (required).

items (Array of Objects):

materialId (ObjectId, reference to Material): The material being ordered (required).

quantity (Number): The quantity of the material ordered (required).

price (Number): The calculated price of the item (including any discounts).

totalPrice (Number): The total cost of all items in the order (required).

status (String, enum: ['Pending', 'Processed', 'Completed', 'Cancelled']): The current status of the order (default: 'Pending').

createdAt (Date): The date when the order was created (defaults to the current date).

updatedAt (Date): The date when the order was last updated (defaults to the current date).

timestamps: Automatically adds createdAt and updatedAt fields.

## Schema Design Summary:

- Material Schema: Represents the products in the inventory with attributes like name, category, unit, base price, stock, and price history.

- Order Schema: Represents customer orders, containing a list of items (referencing materials), total price, and order status.

- Postman Workspace: https://www.postman.com/dark-zodiac-111830/baaz


  


  


