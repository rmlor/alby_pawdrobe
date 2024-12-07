// app.js - main entry point for setting up the AlbyPawsDB application and routes for CRUD operations

/*
    Project: Alby's Custom Pawdrobe (AlbyPawsDB)
    Team: Alby Fanatics (Ruth Lor and Nhu Dang)

    APP SETUP
    - SERVER - Node.js Express server for routing and handling HTTP requests
    - DATABASE - MySQL database for storing application data
    - MIDDLEWARE - Express middleware for parsing JSON, handling static files, and URL-encoded data
    - HANDLEBARS - Templating engine for dynamic HTML rendering of UI routes

    ROUTE SETUP
    - UI ROUTES - Render Handlerbars views for Customers, Dogs, Addresses, Breeds, Products, and Orders pages
    - API ROUTES - Handle GET, POST, PUT, and DELETE requests for CRUD operations
    - API ROUTES - Handle GET requests for dynamic dropdowns used in forms

    API REQUEST TYPES & REQUEST HANDLING METHODS
    - Customers - AJAX Requests via XMLHttpRequest 
    - Dogs - Fetch Requests via Fetch API
    - Addresses - AJAX Requests via XMLHttpRequest 
    - Breeds - Fetch Requests via Fetch API
    - Products - Fetch Requests via Fetch API
    - Orders - Fetch Requests via Fetch API
    - Dog_Breeds - Fetch Requests via Fetch API
    - Order_Products - Fetch Requests via Fetch API
*/

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
    SETUP - SERVER, DATABASE, MIDDLEWARES, HANDLEBARS
*/

// Server
const express = require('express');
const app = express();
const PORT = 4189;

// Database
const db = require('./database/db-connector');

// Middlewares 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// Handlebars
const {engine} = require('express-handlebars');
var exphbs = require('express-handlebars');     
app.engine('.hbs', engine({extname: ".hbs"})); 
app.set('view engine', '.hbs');             

/* 
    UI ROUTES - RENDER HOME PAGE, CUSTOMERS PAGE, DOGS PAGE, ADDRESSES PAGE, BREEDS PAGE, PRODUCTS PAGE, ORDERS PAGE
*/

// HOME PAGE
app.get('/', (req, res) => {
    res.render('index');
});

// CUSTOMERS PAGE
app.get('/customers', function(req, res)
{  
    let selectCustomers = "SELECT * FROM Customers;";                // Define our query

    db.pool.query(selectCustomers, function(error, rows, fields){    // Execute the query
        res.render('customers', {data: rows});                       // Render the index.hbs file, and also send the renderer
    })                
});

// DOGS PAGE
app.get('/dogs', (req, res) => {
    const query = `SELECT dogID AS id, dogName AS name FROM Dogs`;

    db.pool.query(query, (error, results) => {
        if (error) {
            console.error("Error fetching dogs:", error);
            return res.status(500).json({error: "Failed to fetch dogs"});
        }
        res.render('dogs', {data: results});
    });
});

// ADDRESSES PAGE
app.get('/addresses', function (req, res) {                          // GET route to fetch and render the addresses page
    // Query to fetch addresses along with customer names
    const selectAddresses = `
        SELECT 
            Addresses.addressID,
            Addresses.customerID,
            Customers.customerName,
            Addresses.streetAddress,
            Addresses.unit,
            Addresses.city,
            Addresses.state,
            Addresses.postalCode
        FROM Addresses
        LEFT JOIN Customers ON Addresses.customerID = Customers.customerID`;

    // Query to fetch all customers for dropdowns
    const selectCustomers = `SELECT customerID, customerName FROM Customers;`;

    // Fetch addresses with customer names
    db.pool.query(selectAddresses, function (error, addressRows) {
        if (error) {
            console.error('Error fetching addresses:', error);
            return res.status(500).send('Failed to fetch addresses');
        }
        // Fetch customers for dropdowns
        db.pool.query(selectCustomers, function (error, customerRows) {
            if (error) {
                console.error('Error fetching customers:', error);
                return res.status(500).send('Failed to fetch customers');
            }
            // Render the page with addresses and customers
            res.render('addresses', {
                data: addressRows, // Address rows with customer names
                customers: customerRows // Customers for dropdowns
            });
        });
    });
});

// BREEDS PAGE
app.get('/breeds', function(req, res)
{  
    let selectBreeds = "SELECT * FROM Breeds;";               // Define our query

    db.pool.query(selectBreeds, function(error, rows, fields){    // Execute the query

        res.render('breeds', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })                
});  

// PRODUCTS PAGE
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

// ORDERS PAGE
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
    API ROUTES - DATA FOR CRUD OPERATIONS
*/

// POST - CUSTOMERS (HANDLING METHOD: XMLHttpRequest, EXTRACTION: FULL-BODY, QUERIES: PARAMETERIZED)
app.post('/add-customer-ajax', function(req, res) {
    // Capture and return incoming data from request body to be used in SQL query
    let data = req.body;
    console.log(data)

    // Define SQL queries 
    insertQuery = `INSERT INTO Customers (customerName, customerEmail, customerPhone) VALUES (?, ?, ?)`;
    selectQuery = `SELECT * FROM Customers`;

    // Execute nested SQL queries 
    db.pool.query(insertQuery,                                               // INSERT query for adding new record in backend database
                [data.customerName, data.customerEmail, data.customerPhone], 
                function(error, rows, fields) {           
        // Handle API error
        if (error) {
            console.log(error)
            res.sendStatus(400);
        // Handle API response
        } else {
            db.pool.query(selectQuery,                                      // SELECT query for retrieving data for client-side view
                        [data.customerName, data.customerEmail, data.customerPhone],
                        function(error, rows, fields) {       
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

// PUT - CUSTOMERS (HANDLING METHOD: XMLHttpRequest, EXTRACTION: FULL-BODY, QUERIES: PARAMETERIZED)
app.put('/put-customer-ajax', function(req, res, next) {
    // Capture and return incoming data from request body to be used in SQL query
    let data = req.body;
    console.log(data)

    // Extract and parse data from request body
    let customerID = parseInt(data.customerID, 10); // Parse customerID as integer
    let customerEmail = data.customerEmail;         // Extract customerEmail from request
    let customerPhone = data.customerPhone;         // Extract customerPhone from request
    // Validate date from request body
    if (isNaN(customerID)) {
        console.error('Invalid customerID:', data.customerID);
        return res.status(400).json({error: 'Invalid customerID'}); 
    }

    // Define SQL queries
    let updateQuery = `UPDATE Customers SET customerEmail = ?, customerPhone = ? WHERE Customers.customerID = ?`;
    let selectQuery = `SELECT * FROM Customers WHERE Customers.customerID = ?`;

    // Execute nested SQL queries (parameterized)
    db.pool.query(updateQuery,                                                           // UPDATE query for updating (id) record in backend database
                [customerEmail, customerPhone, customerID], 
                function(error, rows, fields) {       
        // Handle API error 
        if (error) {
            console.error('Error updating customer:', error);
            res.sendStatus(400); 
        } 
        // Handle API response
        else {
            db.pool.query(selectQuery, [customerID], function(error, rows, fields) {    // SELECT query for retrieving data for client-side view                       
                // Handle API error
                if (error) {
                    console.error('Error fetching updated customer:', error);
                    res.sendStatus(400);
                } 
                // Handle API response
                else {
                    res.status(200).send(rows); 
                }
            });
        }
    });
});

// DELETE - CUSTOMERS (HANDLING METHOD: XMLHttpRequest, EXTRACTION: FULL-BODY, QUERIES: PARAMETERIZED)
app.delete('/delete-customer-ajax/', function(req, res, next){
    // Capture and return incoming data from request body to be used in SQL query
    let data = req.body;
    console.log(data)

    // Extract and parse data from request body
    let customerID = parseInt(data.id);
    // Validate data from request body
    if (isNaN(customerID)) {
        console.error('Invalid customerID:', data.id);
        return res.status(400).json({ error: 'Invalid customerID' });
    }
    
    // Define SQL query
    let deleteQuery = `DELETE FROM Customers WHERE customerID = ?`;

    // Execute SQL query
    db.pool.query(deleteQuery, [customerID], function(error, rows, fields)   {           // DELETE query for deleting (id) record in backend database
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
});



// POST - ADDRESSES (HANDLING METHOD: XMLHttpRequest, EXTRACTION: FULL-BODY, QUERIES: PARAMETERIZED)
app.post('/add-address-ajax', (req, res) => {
    // Capture and return incoming data from request body to be used in SQL query
    const data = req.body;
    console.log(data)

    // Define SQL queries
    const insertQuery = `
        INSERT INTO Addresses (customerID, streetAddress, unit, city, state, postalCode) 
        VALUES (?, ?, ?, ?, ?, ?)`;
    const selectQuery = `
        SELECT Addresses.*, Customers.customerName 
        FROM Addresses 
        JOIN Customers ON Addresses.customerID = Customers.customerID 
        WHERE Addresses.addressID = ?`;

    // Execute nested SQL queries
    db.pool.query(insertQuery,                                                                                              // INSERT query for adding new record in backend database
                [data.customerID, data.streetAddress, data.unit || null, data.city, data.state, data.postalCode], 
                function(error, rows, fields) {
        if (error) {
            console.error("Error inserting address:", error);
            return res.status(400).send("Error inserting address.");
        } else {
            db.pool.query(selectQuery,                                                                                      // SELECT query for retrieving data for client-side view
                        [results.insertId],
                        (error, rows) => {
                if (error) {
                    console.error("Error fetching new address:", error);
                    return res.status(400).send("Error fetching new address.");
                } else {
                res.json(rows); 
                }
            });
        }
    });
});

// PUT - ADDRESSES (HANDLING METHOD: XMLHttpRequest, EXTRACTION: FULL-BODY, QUERIES: PARAMETERIZED)
app.put('/put-address-ajax', function (req, res) {
    // Capture and return incoming data from request body to be used in SQL query
    const data = req.body;
    console.log(data)

    // Extract and parse data from request body
    let addressID = parseInt(data.addressID, 10);  // Parse addressID as an integer
    let streetAddress = data.streetAddress;        // Extract streetAddress from request
    let unit = data.unit;                          // Extract unit from request (can be NULL)
    let city = data.city;                          // Extract city from request
    let state = data.state;                        // Extract state from request
    let postalCode = data.postalCode;              // Extract postalCode from request
    // Validate data from request body
    if (isNaN(addressID) || !streetAddress || !city || !state || !postalCode) {
        console.error('Invalid or missing address data:', data);
        return res.status(400).json({ error: 'Invalid or missing required fields' });
    }

    // Define SQL queries 
    const updateQuery = `
        UPDATE Addresses 
        SET streetAddress = ?, unit = ?, city = ?, state = ?, postalCode = ?
        WHERE addressID = ?`;
    const selectQuery = `SELECT * FROM Addresses WHERE addressID = ?`;

    // Execute nested SQL queries 
    db.pool.query(updateQuery,                                                         // UPDATE query for updating (id) record in backend database
                  [streetAddress, unit || null, city, state, postalCode, addressID], 
                  function (error, rows, fields) {
        // Handle API error 
        if (error) {
            console.error('Error updating address:', error);
            res.sendStatus(400); 
        } 
        // Handle API response
        else {
            db.pool.query(selectQuery, [addressID], function (error, rows, fields) {   // SELECT query for retrieving data for client-side view
                // Handle API error 
                if (error) {
                    console.error('Error fetching updated address:', error);
                    res.sendStatus(400);
                } 
                // Handle API response
                else {
                    res.status(200).send(rows); 
                }
            });
        }
    });
});

// DELETE - ADDRESSES (HANDLING METHOD: XMLHttpRequest, EXTRACTION: FULL-BODY, QUERIES: PARAMETERIZED)
app.delete('/delete-address-ajax/', function(req, res, next) {
    // Capture and return incoming data from request body to be used in SQL query
    let data = req.body;
    console.log(data);

    // Extract and parse data from request body
    let addressID = parseInt(data.id, 10); // Parse addressID as an integer
    // Validate data from request body
    if (isNaN(addressID)) {
        console.error('Invalid addressID:', data.id);
        return res.status(400).json({ error: 'Invalid addressID' });
    }

    // Define SQL query
    let deleteQuery = `DELETE FROM Addresses WHERE addressID = ?`;

    // Execute SQL query
    db.pool.query(deleteQuery, [addressID], function(error, rows, fields) {           // DELETE query for deleting (id) record in backend database
        // Handle API error
        if (error) {
            console.error('Error deleting address:', error);
            res.sendStatus(400);
        } 
        // Handle API response
        else {
            res.sendStatus(204); // No content
        }
    });
});



// GET - DOGS (HANDLING METHOD: FETCH API, EXTRACTION: NONE, QUERIES: PARAMETERIZED)
app.get('/api/dogs', (req, res) => {
    // Define SQL query
    const selectQuery = `
        SELECT 
            d.dogID, c.customerID, d.dogName, c.customerName, 
            d.upperNeckGirthIn, d.lowerNeckGirthIn, d.chestGirthIn, 
            d.backLengthIn, d.heightLengthIn,
            d.pawWidthIn, d.pawLengthIn
        FROM Dogs d
        LEFT JOIN Customers c ON d.customerID = c.customerID`;
    
    // Execute SQL query
    db.pool.query(selectQuery, (error, results) => {
        if (error) {
            return res.status(500).json({error: "Failed to fetch dogs"}); 
        } 
        res.json(results);
    });
});

// GET - DOGS (ID, HANDLING METHOD: FETCH API, EXTRACTION: DESTRUCTURED, QUERIES: PARAMETERIZED)
app.get('/api/dogs/:dogID', (req, res) => {
    // Capture and return incoming data from request params to be used in SQL query
    const {dogID} = req.params;
    console.log(req.params)

    // Define SQL query
    const selectQuery = `
        SELECT * 
        FROM Dogs
        WHERE dogID = ?`;

    // Execute SQL query
    db.pool.query(selectQuery, [dogID], (error, results) => {
        // Handle API error
        if (error) {
            return res.status(500).json({error: "Failed to fetch dog"});
        // Handle API response: NOT FOUND case
        } else if (results.length === 0) {
            return res.status(404).json({ error: "Dog not found" });
        // Handle API response: FOUND case
        } else {
            res.json(results[0]);
        }
    });
});

// POST - DOGS (HANDLING METHOD: FETCH API, EXTRACTION: DESTRUCTURED, QUERIES: PARAMETERIZED)
app.post('/api/dogs/add', (req, res) => {  
    // Capture and return incoming data from request body to be used in SQL query
    const {
        customerID, dogName, 
        upperNeckGirthIn, lowerNeckGirthIn, chestGirthIn, 
        backLengthIn, heightLengthIn, 
        pawWidthIn, pawLengthIn
    } = req.body;
    console.log(req.body)

    // Define SQL query
    const insertQuery = `
        INSERT INTO Dogs (customerID, dogName, 
                        upperNeckGirthIn, lowerNeckGirthIn, chestGirthIn, 
                        backLengthIn, heightLengthIn, 
                        pawWidthIn, pawLengthIn)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.pool.query(insertQuery,
                    [customerID, dogName, 
                    upperNeckGirthIn, lowerNeckGirthIn, chestGirthIn, 
                    backLengthIn, heightLengthIn, 
                    pawWidthIn, pawLengthIn],
                (error, results) => {
        // Handle API error
        if (error) {
            return res.status(500).json({error: "Failed to add dog"});
        // Handle API response
        } else {
            res.status(201).json({message: "Dog added successfully"});
        }
    });
});

// PUT - DOGS (HANDLING METHOD: FETCH API, EXTRACTION: DESTRUCTURED, QUERIES: PARAMETERIZED)
app.put('/api/dogs/update/:dogID', (req, res) => {
    // Capture and return incoming data from request params and request body to be used in SQL query
    const {dogID} = req.params;
    const {
        customerID, dogName, 
            upperNeckGirthIn, lowerNeckGirthIn, chestGirthIn, 
            backLengthIn, heightLengthIn, 
            pawWidthIn, pawLengthIn
    } = req.body;
    console.log(req.body)

    // Define SQL query
    const updateQuery = `
        UPDATE Dogs
        SET dogName =  ?, 
            upperNeckGirthIn = ?, lowerNeckGirthIn = ?, chestGirthIn = ?, 
            backLengthIn = ?, heightLengthIn = ?, 
            pawWidthIn = ?, pawLengthIn = ?
        WHERE dogID = ?`;

    // Execute SQL query
    db.pool.query(updateQuery,
                [dogName, 
                upperNeckGirthIn, lowerNeckGirthIn, chestGirthIn, 
                backLengthIn, heightLengthIn, 
                pawWidthIn, pawLengthIn, dogID],
                (error) => {
        // Handle API error
        if (error) {
            return res.status(500).json({error: "Failed to update dog"});
        // Handle API response
        } else {
            res.status(200).json({message: "Dog updated successfully"}); 
        }
    });
});

// DELETE - DOGS (HANDLING METHOD: FETCH API, EXTRACTION: DESTRUCTURED, QUERIES: PARAMETERIZED)
app.delete('/api/dogs/delete/:dogID', (req, res) => {
    // Capture and return incoming data from request params and request body to be used in SQL query
    const {dogID} = req.params;
    console.log(dogID)

    // Define SQL query
    const deleteQuery = `DELETE FROM Dogs WHERE dogID = ?`;

    // Execute SQL query
    db.pool.query(deleteQuery, [dogID], (error, results) => {
        //Handle API error
        if (error) {
            res.status(500).send("Failed to delete dog");
        // Handle API response
        } else {
            res.sendStatus(204); 
        }
    });
});



// GET - BREEDS (HANDLING METHOD: FETCH API, EXTRACTION: NONE, QUERIES: INLINE)
app.get('/api/breeds', (req, res) => {
    // Define SQL query
    const selectQuery = `
        SELECT 
            breedID, 
            breedName, 
            breedCoatType, 
            breedShedLevel
        FROM Breeds`;

    // Execute SQL query
    db.pool.query(selectQuery, (error, results) => {
        // Handle API error
        if (error) {
            return res.status(500).json({error: "Failed to fetch breed"}); 
        }
        // Handle API response
        else {
            res.json(results); 
        }
    });
});

// GET - BREEDS (ID, HANDLING METHOD: FETCH API, EXTRACTION: DESTRUCTURED, QUERIES: PARAMETERIZED)
app.get('/api/breeds/:breedID', (req, res) => {
    // Capture and return incoming data from request body to be used in SQL query
    const {breedID} = req.params;
    console.log(breedID)

    // Define SQL query
    const selectQuery = `SELECT * FROM Breeds WHERE breedID = ?`;

    // Execute SQL query 
    db.pool.query(selectQuery, [breedID], (error, results) => {
        // Handle API error
        if (error) {
            return res.status(500).json({error: "Failed to fetch breed"});
        // Handle API response: NOT FOUND case
        } else if (results.length === 0) {
            return res.status(404).json({error: "Breed not found"});
        // Handle API response: FOUND case
        } else {
            res.json(results[0]);
        }
    });
});

// POST - BREEDS (HANDLING METHOD: FETCH API, EXTRACTION: DESTRUCTURED, QUERIES: PARAMETERIZED)
app.post('/api/breeds/add', (req, res) => {
    // Capture and return incoming data from request body to be used in SQL query
    const {breedName, breedCoatType, breedShedLevel} = req.body;
    console.log(req.body)

    // Define SQL query
    const insertQuery = `INSERT INTO Breeds (breedName, breedCoatType, breedShedLevel) VALUES (?, ?, ?)`;

    // Execute SQL query
    db.pool.query(insertQuery, [breedName, breedCoatType, breedShedLevel], (error, results) => {
        // Handle API error
        if (error) {
            console.error('Error adding new breed:', error);
            return res.status(500).json({ error: 'Failed to add new breed', details: error.message });
        // Handle API response
        } else {
            res.json({message: 'Breed added successfully', breedID: results.insertId});
        }
    });
});

// PUT - BREEDS (HANDLING METHOD: FETCH API, EXTRACTION: DESTRUCTURED, QUERIES: PARAMETERIZED)
app.put('/api/breeds/update/:breedID', (req, res) => {
    // Capture and return incoming data from request params and request body to be used in SQL query
    const {breedID} = req.params;
    const {breedName, breedCoatType, breedShedLevel} = req.body;
    console.log(breedID);
    console.log(req.body);

    // Define SQL query
    const updateQuery = `
        UPDATE Breeds 
        SET breedName = ?, breedCoatType = ?, breedShedLevel = ? 
        WHERE breedID = ?`;
    
    // Execute SQL query
    db.pool.query(updateQuery, [breedName, breedCoatType, breedShedLevel, breedID], (error, results) => {
        // Handle API error
        if (error) {
            console.error("Error updating breed:", error);
            return res.status(500).json({error: "Failed to update product"});
        // Handle API response
        } else {
            res.status(200).json({message: "Breed updated successfully"}); 
        }
    });
});

// DELETE - BREEDS (HANDLING METHOD: FETCH API, EXTRACTION: DESTRUCTURED, QUERIES: PARAMETERIZED)
app.delete('/api/breeds/delete/:breedID', (req, res) => {
    // Capture and return incoming data from request params to be used in SQL query
    const {breedID}= req.params;
    console.log(breedID)

    // Define SQL query
    const deleteQuery = 'DELETE FROM Breeds WHERE breedID = ?';

    // Execute SQL query
    db.pool.query(deleteQuery, [breedID], (error, results) => {
        // Handle API error
        if (error) {
            console.error(`Error deleting breed with ID ${breedID}:`, error);
            return res.status(500).json({error: 'Failed to delete breed'});
        // Handle API response
        } else {
            res.status(204).send(); 
        }
    });
});



// GET - DOG_BREEDS (HANDLING METHOD: FETCH API, EXTRACTION: DESTRUCTURED, QUERIES: PARAMETERIZED)
app.get('/api/dogs/:dogID/breeds', (req, res) => {
    // Capture and return incoming data from request params to be used in SQL query
    const {dogID} = req.params;
    console.log(dogID);

    // Define SQL query
    const selectQuery = `
        SELECT 
            db.dogBreedID, 
            db.dogID, db.breedID, 
            d.dogName AS dogName,
            b.breedName AS breedName
        FROM Dog_Breeds db
        JOIN Dogs d ON db.dogID = d.dogID
        JOIN Breeds b ON db.breedID = b.breedID
        WHERE db.dogID = ?`;

    // Execute SQL query
    db.pool.query(selectQuery, [dogID], (error, results) => {
        // Handle API error
        if (error) {
            return res.status(500).json({ error: "Failed to fetch dog breeds" });
        // Handle API response
        } else {
            res.json(results);
        }
    });
});

// GET - DOG_BREEDS (HANDLING METHOD: FETCH API, EXTRACTION: DESTRUCTURED, QUERIES: PARAMETERIZED)
app.get('/api/dog-breeds/:dogBreedID', (req, res) => {
    // Capture and return incoming data from request params to be used in SQL query
    const {dogBreedID} = req.params;
    console.log(req.params)

    // Define SQL query
    const selectQuery = `
        SELECT 
            db.dogBreedID, 
            db.dogID, 
            db.breedID, 
            d.dogName, 
            b.breedName
        FROM Dog_Breeds db
        JOIN Dogs d ON db.dogID = d.dogID
        JOIN Breeds b ON db.breedID = b.breedID
        WHERE db.dogBreedID = ?;`

    db.pool.query(selectQuery, [dogBreedID], (error, results) => {
        // Handle API error
        if (error) {
            return res.status(500).json({error: "Failed to fetch dog breed"});
        // Handle API response: NOT FOUND case
        } else if (results.length === 0) {
            return res.status(404).json({error: "Dog breed not found"});
        // Handle API response: FOUND case
        } else {
            res.json(results[0]);
        }
    });
});

// POST - DOG_BREEDS (HANDLING METHOD: FETCH API, EXTRACTION: DESTRUCTURED, QUERIES: PARAMETERIZED)
app.post('/api/dog-breeds/add', (req, res) => {
    // Capture and return incoming data from request body to be used in SQL query
    const {dogID, breedID} = req.body;
    console.log(req.body)

    // Define SQL query
    const insertQuery = `
        INSERT INTO Dog_Breeds (dogID, breedID)
        VALUES (?, ?)`;

    // Execute SQL query
    db.pool.query(insertQuery, [dogID, breedID], (error, results) => {
        // Handle API error
        if (error) {
            return res.status(500).json({error: "Failed to add dog breed"});
        // Handle API response
        } else {
            res.status(201).json({message: "Dog breed added successfully"});
        }
    });
});

// PUT - DOG_BREEDS (HANDLING METHOD: FETCH API, EXTRACTION: DESTRUCTURED, QUERIES: PARAMETERIZED)
app.put('/api/dog-breeds/update/:dogBreedID', (req, res) => {
    // Capture and return incoming data from request params and request body to be used in SQL query
    const {dogBreedID} = req.params;
    const {breedID} = req.body;
    console.log(req.params)
    console.log(req.body)
    if (!breedID) {
        return res.status(400).json({ error: "breedID is required" });
    }

    // Define SQL query
    const updateQuery = `
        UPDATE Dog_Breeds
        SET breedID = ?
        WHERE dogBreedID = ?`;

    // Execute SQL query
    db.pool.query(updateQuery, [breedID, dogBreedID], (error) => {
        // Handle API error
        if (error) {
            return res.status(500).json({error: "Failed to update dog breed"});
        // Handle API response
        } else {
            res.status(200).json({message: "Dog breed updated successfully"});
        }
    });
});

// DELETE - DOG_BREEDS (HANDLING METHOD: FETCH API, EXTRACTION: DESTRUCTURED, QUERIES: PARAMETERIZED)
app.delete('/api/dog-breeds/delete/:dogBreedID', (req, res) => {
    // Capture and return incoming data from request params to be used in SQL query
    const {dogBreedID} = req.params;
    console.log(dogBreedID)

    // Define SQL query
    const deleteQuery = `
        DELETE FROM Dog_Breeds WHERE dogBreedID = ?`;

    db.pool.query(deleteQuery, [dogBreedID], (error) => {
        // Handle API error
        if (error) {
            return res.status(500).json({error: "Failed to delete dog breed"});
        // Handle API response
        } else {
            res.sendStatus(204);
        }
    });
});



// GET - PRODUCTS (HANDLING METHOD: FETCH API, EXTRACTION: DESTRUCTURED, QUERIES: PARAMETERIZED)
app.get('/api/products', (req, res) => {
    // Define SQL query
    const selectQuery = `
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

    // Execute SQL query
    db.pool.query(selectQuery, (error, results) => {
        // Handle API error
        if (error) {
            return res.status(500).json({error: "Failed to fetch products"}); 
        // Handle API response
        } else {
            res.json(results); 
        }
    });
});

// GET - PRODUCTS (ID, HANDLING METHOD: FETCH API, EXTRACTION: DESTRUCTURED, QUERIES: PARAMETERIZED)
app.get('/api/products/:productID', (req, res) => {
    // Capture and return incoming data from request params and request body to be used in SQL query
    const {productID} = req.params;
    console.log(productID)

    // Define SQL query
    const selectQuery = `
        SELECT * 
        FROM Products
        WHERE productID = ?`;

    // Execute SQL query
    db.pool.query(selectQuery, [productID], (error, results) => {
        // Handle API error
        if (error) {
            return res.status(500).json({error: "Failed to fetch product"});
        // Handle API response: NOT FOUND case
        } else if (results.length === 0) {
            return res.status(404).json({error: "Product not found"});
        // Handle API response: FOUND case
        } else {
            res.json(results[0]);
        }
    });
});

// POST - PRODUCTS (HANDLING METHOD: FETCH API, EXTRACTION: DESTRUCTURED, QUERIES: PARAMETERIZED)
app.post('/api/products/add', (req, res) => {          
    // Capture and return incoming data from request body to be used in SQL query
    const {
        productName, productDescription, productType, 
        productColorBase, productColorStyle, 
        productLiningMaterial, productFillingMaterial, productBasePrice
    } = req.body;
    console.log(req.body)
    
    // Define SQL query
    const insertQuery = `
        INSERT INTO Products (productName, productDescription, productType, productColorBase, productColorStyle, productLiningMaterial, productFillingMaterial, productBasePrice)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    // Execute SQL query
    db.pool.query(insertQuery,
                [productName, productDescription, productType, productColorBase, productColorStyle, productLiningMaterial, productFillingMaterial || null, productBasePrice],
                (error, results) => {
        // Handle API error
        if (error) {
            return res.status(500).json({error: "Failed to add product"});
        // Handle API response
        } else {
            res.status(201).json({message: "Product added successfully"});
        }
    });
});

// PUT - PRODUCTS (HANDLING METHOD: FETCH API, EXTRACTION: DESTRUCTURED, QUERIES: PARAMETERIZED)
app.put('/api/products/update/:productID', (req, res) => {   
    // Capture and return incoming data from request params and request body to be used in SQL query
    const {productID} = req.params;
    const {
        productName, productDescription, productType, 
        productColorBase, productColorStyle, 
        productLiningMaterial, productFillingMaterial, productBasePrice
    } = req.body;
    console.log(productID);
    console.log(req.body); 

    // Define SQL query
    const updateQuery = `
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

    // Execute SQL query
    db.pool.query(updateQuery,
                [productName, productDescription, productType, productColorBase, productColorStyle, productLiningMaterial, productFillingMaterial || null, productBasePrice, productID],
                (error) => {
        // Handle API error
        if (error) {
            return res.status(500).json({error: "Failed to update product"});
        // Handle API response
        } else {
        res.status(200).json({ message: "Product updated successfully" }); 
        }
    });
});

// DELETE - PRODUCTS (HANDLING METHOD: FETCH API, EXTRACTION: DESTRUCTURED, QUERIES: PARAMETERIZED)
app.delete('/api/products/delete/:productID', (req, res) => {
    // Capture and return incoming data from request params to be used in SQL query
    const {productID} = req.params;
    console.log(productID);

    // Define SQL query
    const deleteQuery = `DELETE FROM Products WHERE productID = ?`;

    // Execute SQL query
    db.pool.query(deleteQuery, [productID], (error, results) => {
        // Handle API error
        if (error) {
            return res.status(500).json({error: "Failed to delete product"});
        // Handle API response
        } else {
            res.status(204).json({message: "Product deleted successfully"});
        }
    });
});



// GET - ORDERS (HANDLING METHOD: FETCH API, EXTRACTION: DESTRUCTURED, QUERIES: PARAMETERIZED)
app.get('/api/orders', (req, res) => {
    // Define SQL query
    const selectQuery = `
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
        LEFT JOIN Addresses a ON o.addressID = a.addressID`;
    
    // Execute SQL query
    db.pool.query(selectQuery, (error, results) => {
        // Handle API error
        if (error) {
            return res.status(500).json({error: "Failed to fetch orders"}); 
        // Handle API response
        } else {
            res.json(results);
        }
    });
});

// GET - ORDERS (ID, HANDLING METHOD: FETCH API, EXTRACTION: DESTRUCTURED, QUERIES: PARAMETERIZED)
app.get('/api/orders/:orderID', (req, res) => {
    // Capture and return incoming data from request params to be used in SQL query
    const {orderID} = req.params;
    console.log(req.params)

    // Define SQL query
    const selectQuery = `
        SELECT * 
        FROM Orders 
        WHERE orderID = ?`;

    // Execute SQL query
    db.pool.query(selectQuery, [orderID], (error, results) => {
        // Handle API error
        if (error) {
            return res.status(500).json({error: "Failed to fetch order"});
        // Handle API response: NOT FOUND case
        } else if (results.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        // Handle API response: FOUND case
        } else {
            res.json(results[0]);
        }
    });
});

// POST - ORDERS (HANDLING METHOD: FETCH API, EXTRACTION: DESTRUCTURED, QUERIES: PARAMETERIZED)
app.post('/api/orders/add', (req, res) => {  
    // Capture and return incoming data from request body to be used in SQL query
    const {
        dogID, addressID, 
        orderDate, orderGiftNote, orderCustomRequest, 
        orderStatus, orderShippedDate, orderDeliveredDate,
    } = req.body;
    console.log(req.body)

    // Define SQL query
    const insertQuery = `
        INSERT INTO Orders (dogID, addressID, orderDate, orderGiftNote, orderCustomRequest, orderStatus, orderShippedDate, orderDeliveredDate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.pool.query(insertQuery,
                [dogID, addressID, orderDate, orderGiftNote || null, orderCustomRequest || null, orderStatus, orderShippedDate || null, orderDeliveredDate || null],
                (error, results) => {
        // Handle API error
        if (error) {
            return res.status(500).json({error: "Failed to add order"});
        // Handle API response
        } else {
            res.status(201).json({message: "Order added successfully"});
        }
    });
});

// PUT - ORDERS (HANDLING METHOD: FETCH API, EXTRACTION: DESTRUCTURED, QUERIES: PARAMETERIZED)
app.put('/api/orders/update/:orderID', (req, res) => {
    // Capture and return incoming data from request params and request body to be used in SQL query
    const {orderID} = req.params;
    const {
        addressID,
        orderGiftNote, orderCustomRequest,
        orderStatus, orderShippedDate, orderDeliveredDate,
    } = req.body;
    console.log(orderID)
    console.log(req.body)

    // Define SQL query
    const updateQuery = `
        UPDATE Orders 
        SET addressID = ?, 
            orderGiftNote = ?, orderCustomRequest = ?, 
            orderStatus = ?, orderShippedDate = ?, orderDeliveredDate = ? 
        WHERE orderID = ?`;

    // Execute SQL query
    db.pool.query(updateQuery,
                [addressID, orderGiftNote || null, orderCustomRequest || null, orderStatus, orderShippedDate || null, orderDeliveredDate || null, orderID],
                (error) => {
        // Handle API error
        if (error) {
            return res.status(500).json({error: "Failed to update order"});
        // Handle API response
        } else {
            res.status(200).json({message: "Order updated successfully"}); 
        }
    });
});

// DELETE - ORDERS (HANDLING METHOD: FETCH API, EXTRACTION: DESTRUCTURED, QUERIES: PARAMETERIZED)
app.delete('/api/orders/delete/:orderID', (req, res) => {
    // Capture and return incoming data from request params and request body to be used in SQL query
    const {orderID} = req.params;
    console.log(orderID)

    // Define SQL query
    const deleteQuery = `DELETE FROM Orders WHERE orderID = ?`;

    // Execute SQL query
    db.pool.query(deleteQuery, [orderID], (error, results) => {
        //Handle API error
        if (error) {
            res.status(500).send("Failed to delete order");
        // Handle API response
        } else {
            res.sendStatus(204); 
        }
    });
});



// GET - ORDER_PRODUCTS (HANDLING METHOD: FETCH API, EXTRACTION: DESTRUCTURED, QUERIES: PARAMETERIZED)
app.get('/api/orders/:orderID/products', (req, res) => {
    // Capture and return incoming data from request params to be used in SQL query
    const {orderID} = req.params;
    console.log(orderID)

    // Define SQL query
    const selectQuery = `
        SELECT 
            op.orderProductID, 
            op.orderID, op.productID, 
            p.productName AS productName,
            op.orderProductRequest, op.orderProductSalePrice
        FROM Order_Products op
        JOIN Products p ON op.productID = p.productID
        WHERE op.orderID = ?`;

    // Execute SQL query
    db.pool.query(selectQuery, [orderID], (error, results) => {
        // Handle API error
        if (error) {
            return res.status(500).json({ error: "Failed to fetch order products" });
        // Handle API response
        } else {
            res.json(results);
        }
    });
});

// GET - ORDER_PRODUCTS (HANDLING METHOD: FETCH API, EXTRACTION: DESTRUCTURED, QUERIES: PARAMETERIZED)
app.get('/api/order-products/:orderProductID', (req, res) => {
    // Capture and return incoming data from request params to be used in SQL query
    const {orderProductID} = req.params;
    console.log(req.params)

    // Define SQL query
    const selectQuery = `
        SELECT 
            op.orderProductID, 
            op.orderID, op.productID, 
            op.orderProductRequest, op.orderProductSalePrice
        FROM Order_Products op
        WHERE op.orderProductID = ?`;

    db.pool.query(selectQuery, [orderProductID], (error, results) => {
        // Handle API error
        if (error) {
            return res.status(500).json({error: "Failed to fetch order product"});
        // Handle API response: NOT FOUND case
        } else if (results.length === 0) {
            return res.status(404).json({error: "Order product not found"});
        // Handle API response: FOUND case
        } else {
            res.json(results[0]);
        }
    });
});

// POST - ORDER_PRODUCTS (HANDLING METHOD: FETCH API, EXTRACTION: DESTRUCTURED, QUERIES: PARAMETERIZED)
app.post('/api/order-products/add', (req, res) => {
    // Capture and return incoming data from request body to be used in SQL query
    const {orderID, productID, orderProductRequest, orderProductSalePrice} = req.body;
    console.log(req.body)

    // Define SQL query
    const insertQuery = `
        INSERT INTO Order_Products (orderID, productID, orderProductRequest, orderProductSalePrice)
        VALUES (?, ?, ?, ?)`;

    // Execute SQL query
    db.pool.query(insertQuery, [orderID, productID, orderProductRequest || null, orderProductSalePrice], (error, results) => {
        // Handle API error
        if (error) {
            return res.status(500).json({error: "Failed to add order product"});
        // Handle API response
        } else {
            res.status(201).json({message: "Order product added successfully"});
        }
    });
});

// PUT - ORDER_PRODUCTS (HANDLING METHOD: FETCH API, EXTRACTION: DESTRUCTURED, QUERIES: PARAMETERIZED)
app.put('/api/order-products/update/:orderProductID', (req, res) => {
    // Capture and return incoming data from request params and request body to be used in SQL query
    const {orderProductID} = req.params;
    const {productID, orderProductRequest, orderProductSalePrice} = req.body;
    console.log(req.params)
    console.log(req.body)

    // Define SQL query
    const updateQuery = `
        UPDATE Order_Products 
        SET productID = ?, 
            orderProductRequest = ?, 
            orderProductSalePrice = ? 
        WHERE orderProductID = ?`;

    // Execute SQL query
    db.pool.query(updateQuery, [productID, orderProductRequest || null, orderProductSalePrice, orderProductID], (error) => {
        // Handle API error
        if (error) {
            return res.status(500).json({error: "Failed to update order product"});
        // Handle API response
        } else {
            res.status(200).json({message: "Order product updated successfully"});
        }
    });
});

// DELETE - ORDER_PRODUCTS (HANDLING METHOD: FETCH API, EXTRACTION: DESTRUCTURED, QUERIES: PARAMETERIZED)
app.delete('/api/order-products/delete/:orderProductID', (req, res) => {
    // Capture and return incoming data from request params to be used in SQL query
    const {orderProductID} = req.params;
    console.log(orderProductID)

    // Define SQL query
    const deleteQuery = `
        DELETE FROM Order_Products WHERE orderProductID = ?`;

    db.pool.query(deleteQuery, [orderProductID], (error) => {
        // Handle API error
        if (error) {
            return res.status(500).json({error: "Failed to delete order product"});
        // Handle API response
        } else {
            res.sendStatus(204);
        }
    });
});

/*
    API ROUTES - DATA FOR DYNAMIC DROPDOWNS (FETCH API)
*/

// ADDRESSES DROPDOWN (used in Orders forms)
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

// CUSTOMERS DROPDOWN (used in Dogs & Addresses forms)
app.get('/api/drop/customers', (req, res) => {
    const query = `
        SELECT 
            customerID AS id, 
            CONCAT(customerID, ': ', customerName) 
            AS name 
        FROM Customers`;

    db.pool.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error:"Failed to fetch customer"});
        }
        res.json(results);
    });
});

// DOGS DROPDOWN (used in Orders forms)
app.get('/api/drop/dogs', (req, res) => {
    const query = `
        SELECT 
            dogID AS id, 
            CONCAT(dogID, ': ', dogName) 
            AS name 
        FROM Dogs`;

    db.pool.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({error:"Failed to fetch dogs"});
        }
        res.json(results);
    });
});

// BREEDS DROPDOWN (used in Dogs forms)
app.get('/api/drop/breeds', (req, res) => {
    const query = `
        SELECT 
            breedID AS id, 
            CONCAT(breedID, ': ', breedName) 
            AS name 
        FROM Breeds`;

    db.pool.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({error:"Failed to fetch breeds"});
        }
        res.json(results);
    });
});

// PRODUCTS DROPDOWN (used in Order_Products forms)
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
});

/*
    Listener
*/

app.listen(PORT, () => {
    console.log(`Express started on http://localhost:${PORT}; press Ctrl-C to terminate.`);
});