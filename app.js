/*
    Citation for Express Server, Middleware, and Listener Initializations
    - Date: 12/1/2024
    - Adapted from: Node.js Starter App – Step 0: Getting a Server Running
    - Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js
    - Adaptation Details: Server setup, middleware configuration, and listener initialization were referenced from the repository.
*/

/*
    Citation for Database Connector
    - Date: 12/1/2024
    - Adapted from: Node.js Starter App – Step 1: Connecting to a MySQL Database
    - Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%201%20-%20Connecting%20to%20a%20MySQL%20Database
    - Adaptation Details: Database connection pooling setup was adapted from Step 1 of the repository.
*/

/*
    Citation for Handlebars Integration
    - Date: 12/1/2024
    - Adapted from: Node.js Starter App – Step 3 & Step 4: Dynamically Displaying Data
    - Source URLs
      1. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%203%20-%20Integrating%20a%20Templating%20Engine%20(Handlebars)
      2. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%204%20-%20Dynamically%20Displaying%20Data 
    - Adaptation Details: Handlebars configuration and integration into the project were influenced by Step 3 of the repository.
*/

/*
    Citation for UI Routes
    - Date: 12/1/2024
    - Adapted from: Node.js Starter App – Steps 4, 5, 7 & 8
    - Source URLs
      1. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%204%20-%20Dynamically%20Displaying%20Data
      2. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
      3. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data 
      4. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data
    - Adaptation Details: Rendering Handlebars templates with data passed from the database and structuring UI routes for CRUD functionalities were influenced by Steps 4, 5, 7, and 8 of the repository.
*/

/*
    Citation for API Routes and CRUD Logic
    - Date: 12/1/2024
    - Adapted from:
      1. Web Development Course Modules: Writing Asynchronous Code & Routing and API Responses
      2. Node.js Starter App – Steps 4, 5, 7 & 8
    - Source URLs
      1. https://canvas.oregonstate.edu/courses/1967288/pages/exploration-writing-asynchronous-code?module_item_id=24465423 
      2. https://canvas.oregonstate.edu/courses/1967288/pages/exploration-routing-and-forms?module_item_id=24465437 
      3. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%204%20-%20Dynamically%20Displaying%20Data
      4. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
      5. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data 
      6. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data
    - Adaptation Details: API design patterns for handling request/response data and implementation logic for CRUD operations were respectively informed by Web Development modules and Node.js Starter App repository.
*/

/*
    Citation for Dropdown API Implementation
    - Date: 12/1/2024
    - Adapted from: 
      1. Web Development Course Modules: Writing Asynchronous Code
      2. Node.js Starter App – Step 6
    - Source URLs
      1. https://canvas.oregonstate.edu/courses/1967288/pages/exploration-writing-asynchronous-code?module_item_id=24465423  
      2. https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%206%20-%20Dynamically%20Filling%20Dropdowns%20and%20Adding%20a%20Search%20Box
    - Adaptation Details: Dynamic dropdowns implemented using API endpoints and population logic were respectively informed by Web Development modules and Node.js Starter App repository.
*/

/*
    SETUP - Server, Database, Middleware, Handlebars
*/

// Server
const express = require('express');
const app = express();
const PORT = 4189;

// Database
const db = require('./database/db-connector');

// App (Middleware)
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     
app.engine('.hbs', engine({extname: ".hbs"})); 
app.set('view engine', '.hbs');             

/* 
    UI ROUTES - Render Pages
*/

// Home page 
app.get('/', (req, res) => {
    res.redirect('/orders');
});

app.get('/dogs', (req, res) => {
    const query = `SELECT dogID AS id, dogName AS name FROM Dogs`;

    db.pool.query(query, (error, results) => {
        if (error) {
            console.error("Error fetching dogs:", error);
            return res.status(500).json({error: "Failed to fetch dogs"});
        }
        res.json(results);
    });
});

app.get('/addresses', (req, res) => {
    const query = `SELECT * FROM Addresses`;
    
    db.pool.query(query, (error, results) => {
        if (error) {
            console.error("Error fetching addresses:", error);
            return res.status(500).json({error: "Failed to fetch addresses"});
        }
        res.json(results);
    });
});

app.get('/products', (req, res) => {
    const query = `SELECT * FROM Products`;
    
    db.pool.query(query, (error, results) => {
        if (error) {
            console.error("Error fetching products:", error);
            return res.status(500).json({error: "Failed to fetch products"});
        }
        res.render('products', {data: results});
    });
});
app.get('/orders', (req, res) => {
    const query = `
        SELECT 
            o.orderID, c.customerID, d.dogID, a.addressID,
            c.customerName, d.dogName, o.orderDate,
            o.orderGiftNote, o.orderCustomRequest, o.orderStatus,
            o.orderShippedDate, o.orderDeliveredDate
        FROM Orders o
        LEFT JOIN Dogs d ON o.dogID = d.dogID
        LEFT JOIN Customers c ON d.customerID = c.customerID
        LEFT JOIN Addresses a ON o.addressID = a.addressID;`;
    
    db.pool.query(query, (error, results) => {
        if (error) {
            console.error("Error fetching orders:", error);
            return res.status(500).json({error: "Failed to fetch orders"}); // JSON for errors
        }
        res.render('orders', {data: results});
    });
});

/*
    API ROUTES - Dynamic Dropdowns (JSON)
*/

// Addresses for Orders forms
app.get('/api/drop/addresses', (req, res) => {
    const query= `
        SELECT 
            addressID AS id, 
            CONCAT(addressID, ': ', streetAddress, 
                   IF(unit IS NOT NULL AND unit != '', CONCAT(', ', unit), ''), 
                   ', ', city, ', ', state, ', ', postalCode) 
            AS label 
        FROM Addresses`;
    db.pool.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({error: "Failed to fetch addresses"});
        }
        res.json(results);
    });
});

// Dogs for Orders forms
app.get('/api/drop/dogs', (req, res) => {
    const query = `
        SELECT 
            dogID AS id, 
            CONCAT(dogID, ': ', dogName) 
            AS name 
        FROM Dogs`;

    db.pool.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error:"Failed to fetch dogs"});
        }
        res.json(results);
    });
});

// Products for Order_Products forms
app.get('/api/drop/products', (req, res) => {
    const query = `
        SELECT 
            productID AS id, 
            CONCAT(productID, ': ', productName) 
            AS name 
        FROM Products`;

    db.pool.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({error: "Failed to fetch products"}); 
        }
        res.json(results); 
    });
  
/*
    API ROUTES - Products (JSON)
*/

// GET - Products
app.get('/api/products', (req, res) => {
    const query = `
        SELECT 
            productID, 
            productName, 
            productDescription, 
            productType, 
            productColorBase, 
            productColorStyle, 
            productLiningMaterial, 
            productFillingMaterial, 
            productBasePrice
        FROM Products`;

    db.pool.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({error: "Failed to fetch products"}); 
        }
        res.json(results); 
    });
});

// GET - product by ID (Products)
app.get('/api/products/:productID', (req, res) => {
    const {productID} = req.params;
    const query = `
        SELECT * 
        FROM Products
        WHERE productID = ?`;

    db.pool.query(query, [productID], (error, results) => {
        if (error) {
            return res.status(500).json({error: "Failed to fetch product"});
        } else if (results.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        } else {
            res.json(results[0]);
        }
    });
});

// POST - new products (Products)
app.post('/api/products/add', (req, res) => {          
    const {
        productName, productDescription, productType, 
        productColorBase, productColorStyle, 
        productLiningMaterial, productFillingMaterial, productBasePrice
    } = req.body;

    const query = `
        INSERT INTO Products (productName, productDescription, productType, productColorBase, productColorStyle, productLiningMaterial, productFillingMaterial, productBasePrice)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.pool.query(query,
                [productName, productDescription, productType, productColorBase, productColorStyle, productLiningMaterial, productFillingMaterial || null, productBasePrice],
                (error, results) => {
        if (error) {
            return res.status(500).json({error: "Failed to add product"});
        }
        res.status(201).json({message: "Product added successfully"});
        }
    );
});

// PUT - product by ID (Products)
app.put('/api/products/update/:productID', (req, res) => {       
    const {productID} = req.params;
    const {
        productName, productDescription, productType, 
        productColorBase, productColorStyle, 
        productLiningMaterial, productFillingMaterial, productBasePrice
    } = req.body;

    console.log('Update Request for Product:', productID);
    console.log('Update Data:', req.body);

    const query = `
        UPDATE Products
        SET productName = ?, 
            productDescription = ?, 
            productType = ?, 
            productColorBase = ?, 
            productColorStyle = ?, 
            productLiningMaterial = ?, 
            productFillingMaterial = ?, 
            productBasePrice = ?
        WHERE productID = ?;`;

    db.pool.query(query,
                [productName, productDescription, productType, productColorBase, productColorStyle, productLiningMaterial, productFillingMaterial || null, productBasePrice, productID],
                (error) => {
        if (error) {
            return res.status(500).json({error: "Failed to update product"});
        }
        res.status(200).json({ message: "Product updated successfully" }); 

// DELETE - product by ID (Products)
app.delete('/api/products/delete/:productID', (req, res) => {
    const {productID} = req.params;

    console.log('Delete Request for Product ID:', productID);

    const query = `DELETE FROM Products WHERE productID = ?`;

    db.pool.query(query, [productID], (error, results) => {
        if (error) {
            console.error("Error deleting product:", error); 
            return res.status(500).json({error: "Failed to delete product"});
        } else if (results.affectedRows === 0) {
            console.warn("Product not found:", productID); // Debugging log
            return res.status(404).json({error: "Product not found"});
        } else {
            res.status(200).json({message: "Product deleted successfully"});
        }
    });
});

/*
    API ROUTES - Orders (JSON)
*/

// GET - Orders
app.get('/api/orders', (req, res) => {
    const query = `
        SELECT 
            o.orderID,
            c.customerID,
            d.dogID,
            a.addressID,
            c.customerName,
            d.dogName,
            o.orderDate,
            o.orderGiftNote,
            o.orderCustomRequest,
            o.orderStatus,
            o.orderShippedDate,
            o.orderDeliveredDate
        FROM Orders o
        LEFT JOIN Dogs d ON o.dogID = d.dogID
        LEFT JOIN Customers c ON d.customerID = c.customerID
        LEFT JOIN Addresses a ON o.addressID = a.addressID;`;
    
    db.pool.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({error: "Failed to fetch orders"}); 
        }
        res.json(results); 
    });
});

// GET - order by ID (Orders)
app.get('/api/orders/:orderID', (req, res) => {
    const {orderID} = req.params;
    const query = `
        SELECT * 
        FROM Orders 
        WHERE orderID = ?`;

    db.pool.query(query, [orderID], (error, results) => {
        if (error) {
            return res.status(500).json({error: "Failed to fetch order"});
        } else if (results.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        } else {
            res.json(results[0]);
        }
    });
});

// POST - new order (Orders)
app.post('/api/orders/add', (req, res) => {                
    const {
        dogID, addressID, 
        orderDate, orderGiftNote, orderCustomRequest, 
        orderStatus, orderShippedDate, orderDeliveredDate,
    } = req.body;

    const query = `
        INSERT INTO Orders (dogID, addressID, orderDate, orderGiftNote, orderCustomRequest, orderStatus, orderShippedDate, orderDeliveredDate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.pool.query(query,
                [dogID, addressID, orderDate, orderGiftNote || null, orderCustomRequest || null, orderStatus, orderShippedDate || null, orderDeliveredDate || null],
                (error, results) => {
        if (error) {
            return res.status(500).json({error: "Failed to add order"});
        }
        res.status(201).json({message: "Order added successfully"});
        }
    );
});

// PUT - order by ID (Orders)
app.put('/api/orders/update/:orderID', (req, res) => {
    const { orderID } = req.params;
    const {
        addressID,
        orderGiftNote, orderCustomRequest,
        orderStatus, orderShippedDate, orderDeliveredDate,
    } = req.body;
    const query = `
        UPDATE Orders 
        SET addressID = ?, 
            orderGiftNote = ?, orderCustomRequest = ?, 
            orderStatus = ?, orderShippedDate = ?, orderDeliveredDate = ? 
        WHERE orderID = ?`;

    db.pool.query(query,
                [addressID, orderGiftNote || null, orderCustomRequest || null, orderStatus, orderShippedDate || null, orderDeliveredDate || null, orderID],
                (error) => {
        if (error) {
            return res.status(500).json({error: "Failed to update order"});
        }
        res.status(200).json({ message: "Order updated successfully" }); 
        }
    );
});

// DELETE - order by ID (Orders)
app.delete('/api/orders/delete/:orderID', (req, res) => {
    const {orderID} = req.params;
    const query = `DELETE FROM Orders WHERE orderID = ?`;
  
  // DELETE - order product by ID (Order_Products)
app.delete('/api/order-products/delete/:orderProductID', (req, res) => {
    const { orderProductID } = req.params;
    const query = `
        DELETE FROM Order_Products WHERE orderProductID = ?`;

    db.pool.query(query, [orderProductID], (error) => {
        if (error) {
            return res.status(500).json({ error: "Failed to delete order product" });
        }
        res.sendStatus(200);
    });
});
  
/*
    API ROUTES - Order_Products (JSON)
*/

// GET - Order_Products where orderID = ? (Order_Products)
app.get('/api/orders/:orderID/products', (req, res) => {
    const { orderID } = req.params;
    const query = `
        SELECT 
            op.orderProductID, 
            op.orderID, op.productID, 
            p.productName AS productName,
            op.orderProductRequest, op.orderProductSalePrice
        FROM Order_Products op
        JOIN Products p ON op.productID = p.productID
        WHERE op.orderID = ?`;

    db.pool.query(query, [orderID], (error, results) => {
        if (error) {
            return res.status(500).json({ error: "Failed to fetch order products" });
        }
        res.json(results);
    });
});

// GET - order product by ID (Order_Products)
app.get('/api/order-products/:orderProductID', (req, res) => {
    const { orderProductID } = req.params;
    const query = `
        SELECT 
            op.orderProductID, 
            op.orderID, op.productID, 
            op.orderProductRequest, op.orderProductSalePrice
        FROM Order_Products op
        WHERE op.orderProductID = ?`;

    db.pool.query(query, [orderProductID], (error, results) => {
        if (error) {
            return res.status(500).json({error: "Failed to fetch order product"});
        } else if (results.length === 0) {
            return res.status(404).json({error: "Order product not found"});
        } else {
        res.json(results[0]);
        }
    });
});

// POST - new order product (Order_Products)
app.post('/api/order-products/add', (req, res) => {
    const { orderID, productID, orderProductRequest, orderProductSalePrice } = req.body;
    const query = `
        INSERT INTO Order_Products (orderID, productID, orderProductRequest, orderProductSalePrice)
        VALUES (?, ?, ?, ?)`;

    db.pool.query(query, [orderID, productID, orderProductRequest || null, orderProductSalePrice], (error, results) => {
        if (error) {
            return res.status(500).json({error: "Failed to add order product"});
        }
        res.status(201).json({message: "Order product added successfully"});
    });
});

// PUT - order product by ID (Order_Products)
app.put('/api/order-products/update/:orderProductID', (req, res) => {
    const { orderProductID } = req.params;
    const { productID, orderProductRequest, orderProductSalePrice } = req.body;
    const query = `
        UPDATE Order_Products 
        SET productID = ?, 
            orderProductRequest = ?, 
            orderProductSalePrice = ? 
        WHERE orderProductID = ?`;

    db.pool.query(query, [productID, orderProductRequest || null, orderProductSalePrice, orderProductID], (error) => {
        if (error) {
            return res.status(500).json({error: "Failed to update order product"});
        }
        res.status(200).json({ message: "Order product updated successfully" });
    });
});


// BREEDS PAGE START

app.get('/breeds', function(req, res)
{  
    let selectBreeds = "SELECT * FROM Breeds;";               // Define our query

    db.pool.query(selectBreeds, function(error, rows, fields){    // Execute the query

        res.render('breeds', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })                
});  


// BREEDS PAGE END



// ADRESSES PAGE START

app.get('/addresses', function(req, res)
{  
    // Declare Query 1
    let selectAddresses = "SELECT * FROM Addresses;";  

    // Query 2 is the same in both cases
    let selectCustomers = "SELECT * FROM Customers;";

    // Run the 1st query
    db.pool.query(selectAddresses, function(error, rows, fields){
        
        // Save the people
        let address = rows;
        
        // Run the second query
        db.pool.query(selectCustomers, (error, rows, fields) => {
            
            // Save the planets
            let customers = rows;
            return res.render('addresses', {data: address, customers: customers});
        })               
})

});

app.post('/add-address-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let customerID = parseInt(data.customerID);

    let streetAddress = data.streetAddress;

    let unit = data.unit;
    if (isNaN(unit))
        {
            unit = 'NULL'
        }
    let city = data.city;

    let state = data.state;

    let postalCode = parseInt(data.postalCode);

    // Create the query and run it on the database
    query1 = `INSERT INTO Addresses (customerID, streetAddress, unit, city, state, postalCode) VALUES ('${data.customerID}', '${data.streetAddress}', '${data,unit}', '${data.city}', '${data.state}', '${data.postalCode}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM Addresses;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-address-ajax/', function(req,res,next){
    let data = req.body;
    let addressID = parseInt(data.id);
    console.log(data)
    let deleteAddress = `DELETE FROM Addresses WHERE addressID = ?`;
    
        // Run the 1st query
        db.pool.query(deleteAddress, [addressID], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    
    })});

app.put('/put-address-ajax', function(req,res,next){
    let data = req.body;

    console.log(data)

    let streetAddress = data.streetAddress;
    let unit = data.unit;
    let city = data.city;
    let state = data.state;
    let postalCode = data.postalCode;
    let addressID = parseInt(data.addressID);
    
    let queryUpdateAddress = `UPDATE Addresses SET streetAddress = ?, unit = ?, city = ?, state = ?, postalCode = ? WHERE Addresses.addressID = ?`;
    let selectAddress= `SELECT * FROM Addresses WHERE Addresses.addressID = ?`
    
        // Run the 1st query
        db.pool.query(queryUpdateAddress, [streetAddress, unit, city, state, postalCode, addressID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return that data so we can use it to update the people's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(selectAddress, [addressID], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});

// ADDRESSES PAGE END



// CUSTOMERS PAGE START

app.get('/customers', function(req, res)
{  
    let selectCustomers = "SELECT * FROM Customers;";               // Define our query

    db.pool.query(selectCustomers, function(error, rows, fields){    // Execute the query


    db.pool.query(query, [orderID], (error, results) => {
        if (error) {
            res.status(500).send("Failed to delete order");
        } else if (results.affectedRows === 0) {
            res.status(404).send("Order not found");
        } else {
            res.sendStatus(200); 
        }
    });
});
      
//delete customer

app.delete('/delete-customer-ajax/', function(req,res,next){
    let data = req.body;
    let customerID = parseInt(data.id);
    console.log(data)
    let deleteCustomer = `DELETE FROM Customers WHERE customerID = ?`;
    
    
            // Run the 1st query
            db.pool.query(deleteCustomer, [customerID], function(error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204);
            }
    
    })});

app.put('/put-customer-ajax', function(req,res,next){
    let data = req.body;

    console.log(data)

    let customerName = parseInt(data.customerName);
    let customerEmail = data.customerEmail;
    let customerPhone = data.customerPhone;

    let queryUpdateCustomer = `UPDATE Customers SET customerEmail = ?, customerPhone = ? WHERE Customers.customerID = ?`;
    let selectCustomer = `SELECT * FROM Customers WHERE Customers.customerID = ?`

        // Run the 1st query
        db.pool.query(queryUpdateCustomer, [customerEmail, customerPhone, customerName], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return that data so we can use it to update the people's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(selectCustomer, [customerName], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});

// CUSTOMERS PAGE END


/*
    Listener
*/

app.listen(PORT, () => {
    console.log(`Express started on http://localhost:${PORT}; press Ctrl-C to terminate.`);
});
