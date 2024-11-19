/*
    SETUP
*/
//Step 0: Node.js
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 9124;                 // Set a port number at the top so it's easy to change in the future
//Step 1: (MySQL) Database
var db = require('./database/db-connector')

/*
    ROUTES
*/

app.get('/', function(req, res)                 // This is the basic syntax for what is called a 'route'
    {
        res.send("The server is running!")      // This function literally sends the string "The server is running!" to the computer
    });                                         // requesting the web site.

app.get('/Order_Products', function(req,res) {       //Fetch all customers
    console.log('Route /Order_Products accessed');
    //define queries
    disableForeignKeyChecks = `SET FOREIGN_KEY_CHECKS = 0;`;
    queryDropOrderProducts = `DROP TABLE IF EXISTS Order_Products`;
    queryCreateOrderProducts = `CREATE TABLE Order_Products (
        orderProductID INT(11) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        orderID INT(11) UNSIGNED NOT NULL,
        productID INT(11) UNSIGNED NOT NULL,
        orderProductRequest VARCHAR(255) NULL,
        orderProductSalePrice DECIMAL(8, 2) NOT NULL,
        FOREIGN KEY (orderID) REFERENCES Orders(orderID) ON DELETE RESTRICT,
        FOREIGN KEY (productID) REFERENCES Products(productID) ON DELETE RESTRICT
        );`;
    queryInsertOrderProducts = `INSERT INTO Order_Products (
        orderID, productID, orderProductRequest, orderProductSalePrice) 
        VALUES (1, 1, 'Add daisy-themed buttons and lace', 42.50);`;
    querySelectOrderProducts =`SELECT Order_Products.*, Products.productName 
        FROM Order_Products 
        JOIN Products ON Order_Products.productID = Products.productID 
        WHERE orderID = :orderID
        ;`;
    enableForeignKeyChecks = `SET FOREIGN_KEY_CHECKS = 1;`;
    //execute queries in asynchronous manner
    db.pool.query(disableForeignKeyChecks, function (err, results, fields) {
        if (err) {
            console.error('Error disabling foreign key checks:', err);
            res.status(500).send('Error disabling foreign key checks');
            return;
        }

        db.pool.query(queryDropOrderProducts, function (err, results, fields) {
            if (err) {
                console.error('Error in DROP TABLE:', err);
                res.status(500).send('Error in DROP TABLE');
                return;
            }
            console.log('Dropped Order_Products table');

            db.pool.query(queryCreateOrderProducts, function (err, results, fields) {
                if (err) {
                    console.error('Error in CREATE TABLE:', err);
                    res.status(500).send('Error in CREATE TABLE');
                    return;
                }
                console.log('Created Order_Products table');

                db.pool.query(enableForeignKeyChecks, function (err, results, fields) {
                    if (err) {
                        console.error('Error enabling foreign key checks:', err);
                        res.status(500).send('Error enabling foreign key checks');
                        return;
                    }
                    console.log('Foreign key checks re-enabled');
                    res.send('Order_Products table reset successfully');
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