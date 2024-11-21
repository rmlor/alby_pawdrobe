/*
    SETUP
*/

var express = require('express');                   // We are using the express library for the web server
var app     = express();                            // We need to instantiate an express object to interact with the server in our code
PORT        = 4189;                                 // Set a port number at the top so it's easy to change in the future

var db = require('./database/db-connector')         // Connecting to database

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');         // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));      // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                     // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
    
        // Define our queries
    query1 = 'DROP TABLE IF EXISTS diagnostic;';
    query2 = 'CREATE TABLE diagnostic(id INT PRIMARY KEY AUTO_INCREMENT, text VARCHAR(255) NOT NULL);';
    query3 = 'INSERT INTO diagnostic (text) VALUES ("MySQL is working for lorr!")'; //replace with your onid
    query4 = 'SELECT * FROM diagnostic;';

    // Execute every query in an asynchronous manner, we want each query to finish before the next one starts

    // DROP TABLE...
    db.pool.query(query1, function (err, results, fields){

        // CREATE TABLE...
        db.pool.query(query2, function(err, results, fields){

            // INSERT INTO...
            db.pool.query(query3, function(err, results, fields){

                // SELECT *...
                db.pool.query(query4, function(err, results, fields){

                    // Send the results to the browser
                    res.send(JSON.stringify(results));
                });
            });
        });
    });
});
*/
app.get('/', function(req, res)
{
    res.render('index');                        // Note the call to render() and not send(). Using render() ensures the templating engine
});                                             // will process this file, before sending the finished HTML to the client.

app.get('/products', function(req, res)             //Fetch Products
{
    //Define query
    let queryProducts = `
        SELECT productID, productName, productDescription, 
            productType, productColorBase, productColorStyle, 
            productLiningMaterial, productFillingMaterial, productBasePrice 
        FROM Products;
    `;

    //Execute query
    db.pool.query(queryProducts, function (error, results, fields) {
        res.render('products', {data: results});
    })
});

app.get('/orders', function(req, res) {
    // Define queries
    let queryOrders = `SELECT orderID, dogID, addressID, orderDate, orderGiftNote, 
                       orderCustomRequest, orderStatus, orderShippedDate, orderDeliveredDate
                       FROM Orders;`;
    let queryDogs = `SELECT dogID, dogName FROM Dogs;`;
    let queryAddresses = `SELECT addressID, streetAddress, unit, city, state, postalCode FROM Addresses;`;

    // Execute the queries
    db.pool.query(queryOrders, function (error, orderRows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            let orders = orderRows;

            db.pool.query(queryDogs, function (error, dogRows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(500);
                } else {
                    let dogs = dogRows;

                    db.pool.query(queryAddresses, function (error, addressRows, fields) {
                        if (error) {
                            console.log(error);
                            res.sendStatus(500);
                        } else {
                            let addresses = addressRows;

                            // Render the page with all data
                            res.render('orders', {
                                data: orders,
                                dogs: dogs,
                                addresses: addresses,
                            });
                        }
                    });
                }
            });
        }
    });
});

app.post('/add-order-ajax', function (req, res) {
    let data = req.body;

    // Capture NULL values
    let orderGiftNote = data.orderGiftNote || null;
    let orderCustomRequest = data.orderCustomRequest || null;
    let orderShippeDate = data.orderShippedDate || null;
    let orderDeliveredDate = data.orderDeliveredDate || null;

    // Query with placeholders
    let queryAddOrder = `
        INSERT INTO Orders(dogID, addressID, orderDate, orderGiftNote, 
                           orderCustomRequest, orderStatus, orderShippedDate, orderDeliveredDate)
        VALUES (?, ?, ?, ?, ?, ?,?,?);
    `;

    // Run the query
    db.pool.query(
        queryAddOrder,
        [
            data.dogID,
            data.addressID,
            data.orderDate,
            orderGiftNote,
            orderCustomRequest,
            data.orderStatus,
            data.orderShippedDate,
            data.orderDeliveredDate
        ],
        function (error, rows, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                let querySelectOrders = `
                    SELECT orderID, dogID, addressID, orderDate, orderGiftNote, 
                           orderCustomRequest, orderStatus, orderShippedDate, orderDeliveredDate
                    FROM Orders;
                `;

                db.pool.query(querySelectOrders, function (error, rows, fields) {
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                });
            }
        }
    );
});


app.put('/edit-order-ajax', function (req, res) {
    let data = req.body;

    let queryUpdateOrder = `
        UPDATE Orders
        SET dogID = ?, addressID = ?, orderDate = ?, orderGiftNote = ?, 
            orderCustomRequest = ?, orderStatus = ?, orderShippedDate = ?, orderDeliveredDate = ?
        WHERE orderID = ?;
    `;

    let querySelectOrder = `
        SELECT orderID, dogID, addressID, orderDate, orderGiftNote, 
               orderCustomRequest, orderStatus, orderShippedDate, orderDeliveredDate
        FROM Orders
        WHERE orderID = ?;
    `;

    db.pool.query(
        queryUpdateOrder,
        [
            data.dogID,
            data.addressID,
            data.orderDate,
            data.orderGiftNote || null,
            data.orderCustomRequest || null,
            data.orderStatus,
            data.orderShippedDate || null,
            data.orderDeliveredDate || null,
            data.orderID
        ],
        function (error, rows, fields) {
            if (error) {
                console.error("Error updating order:", error);
                res.sendStatus(400);
            } else {
                db.pool.query(querySelectOrder, [data.orderID], function (error, rows, fields) {
                    if (error) {
                        console.error("Error fetching updated order:", error);
                        res.sendStatus(400);
                    } else {
                        res.json(rows[0]); // Send back the updated row as JSON
                    }
                });
            }
        }
    );
});


app.delete('/delete-order-ajax', function (req, res, next) {
    let data = req.body;
    let orderID = parseInt(data.id);

    let deleteOrderProductsQuery = `DELETE FROM Order_Products WHERE orderID = ?;`;
    let deleteOrderQuery = `DELETE FROM Orders WHERE orderID = ?;`;

    // First, delete associated products from the `Order_Products` table
    db.pool.query(deleteOrderProductsQuery, [orderID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            // Then, delete the order from the `Orders` table
            db.pool.query(deleteOrderQuery, [orderID], function (error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204); // No Content
                }
            });
        }
    });
});

app.get('/orders/:id/products', (req, res) => {
    let orderID = req.params.id;

    let query = `
        SELECT op.orderProductID, op.productID, p.productName, 
               op.orderProductRequest, op.orderProductSalePrice
        FROM Order_Products op
        JOIN Products p ON op.productID = p.productID
        WHERE op.orderID = ?;
    `;

    db.pool.query(query, [orderID], (error, rows) => {
        if (error) {
            console.error("Error fetching products for orderID", orderID, error);
            res.sendStatus(500);
        } else {
            console.log("Fetched products for orderID", orderID, rows);
            res.json(rows);
        }
    });
});


// Add a purchased product
app.post('/orders/:id/products/add', (req, res) =>
{
    let data = req.body;

    let query = `
        INSERT INTO Order_Products (orderID, productID, orderProductRequest, orderProductSalePrice)
        VALUES (?, ?, ?, ?);
    `;

    db.pool.query(
        query,
        [data.orderID, data.productID, data.orderProductRequest, data.orderProductSalePrice],
        (error, results) => {
            if (error) {
                console.log(error);
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        }
    );
});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
