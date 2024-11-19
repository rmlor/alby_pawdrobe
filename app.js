/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 4189;                 // Set a port number at the top so it's easy to change in the future
var db = require('./database/db-connector')
/*
    ROUTES
*/

app.get('/Order_Products', function(req, res) {     //Fetch Order_Products
    // Define queries
    queryDropOrderProducts = `DROP TABLE IF EXISTS Order_Products;`;
    queryCreateOrderProducts = `CREATE TABLE Order_Products (
        orderProductID INT(11) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        orderID INT(11) UNSIGNED NOT NULL,
        productID INT(11) UNSIGNED NOT NULL,
        orderProductRequest VARCHAR(255) NULL,
        orderProductSalePrice DECIMAL(8, 2) NOT NULL,
        FOREIGN KEY (orderID) REFERENCES Orders(orderID) ON DELETE RESTRICT,
        FOREIGN KEY (productID) REFERENCES Products(productID) ON DELETE RESTRICT
    );`;
    queryInsertOrderProducts = `INSERT INTO Order_Products (orderID, productID, orderProductRequest, orderProductSalePrice) 
        VALUES (1, 1, 'Add daisy-themed buttons and lace', 42.50);`; 
    querySelectOrderProducts = `SELECT Order_Products.*, Products.productName 
        FROM Order_Products 
        JOIN Products ON Order_Products.productID = Products.productID`;

    // Execute queries in an asynchronous manner with error logging
    db.pool.query(queryDropOrderProducts, function (err, results, fields) {
        db.pool.query(queryCreateOrderProducts, function (err, results, fields) {
            db.pool.query(queryInsertOrderProducts, function (err, results, fields) {
                db.pool.query(querySelectOrderProducts, function (err, results, fields) {
                    // Send results to the browser
                    res.send(JSON.stringify(results));
                });
            });
        });
    });
});
    
/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
