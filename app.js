/*
    SETUP
*/
var express = require('express');                   // We are using the express library for the web server
var app     = express();                            // We need to instantiate an express object to interact with the server in our code
PORT        = 4189;                                 // Set a port number at the top so it's easy to change in the future
var db = require('./database/db-connector')         // Connecting to database
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');         // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));      // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                     // Tell express to use the handlebars engine whenever it encounters a *.hbs file.
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

/*
    ROUTES
*/
app.get('/', function(req, res)
    {
        res.render('index');                        // Note the call to render() and not send(). Using render() ensures the templating engine
    });                                             // will process this file, before sending the finished HTML to the client.

//View All Products
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

//View All Orders
app.get('/orders', function(req, res)           //Fetch Orders
{
    //Define query
    let queryOrders = `
        SELECT orderID, dogID, addressID, orderDate, orderGiftNote, 
            orderCustomRequest, orderStatus, orderShippedDate, orderDeliveredDate
        FROM Orders;
        JOIN Dogs d ON o.dogID = d.dogID
        JOIN Customers c ON d.customerID = c.customerID
        JOIN Addresses a ON o.addressID = a.addressID;
    `;

    //Execute query
    db.pool.query(queryOrders, (error, results, fields) => {
        res.render('orders', {data: results});
    });
});

// Add Order (AJAX)
app.post('/add-orders-ajax', function (req, res) {
    let data = req.body;

    let queryAddOrder = `
        INSERT INTO Orders (dogID, addressID, orderDate, orderGiftNote, orderCustomRequest, orderStatus)
        VALUES (?, ?, ?, ?, ?, 'received');
    `;

    db.pool.query(
        queryAddOrder,
        [data.dogID, data.addressID, data.orderDate, data.orderGiftNote || null, data.orderCustomRequest || null],
        function (error, results, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                let queryLastOrder = `
                    SELECT o.orderID, d.dogName, c.customerName, a.fullAddress AS address, o.orderDate, 
                           o.orderGiftNote, o.orderCustomRequest, o.orderStatus, 
                           o.orderShippedDate, o.orderDeliveredDate
                    FROM Orders o
                    JOIN Dogs d ON o.dogID = d.dogID
                    JOIN Customers c ON d.customerID = c.customerID
                    JOIN Addresses a ON o.addressID = a.addressID
                    WHERE o.orderID = LAST_INSERT_ID();
                `;
                db.pool.query(queryLastOrder, function (error, rows, fields) {
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

// Delete Order (AJAX)
app.delete('/delete-order-ajax', function (req, res) {
    let data = req.body;

    let queryDeleteOrderProducts = `DELETE FROM Order_Products WHERE orderID = ?;`;
    let queryDeleteOrder = `DELETE FROM Orders WHERE orderID = ?;`;

    db.pool.query(queryDeleteOrderProducts, [data.id], function (error, results, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            db.pool.query(queryDeleteOrder, [data.id], function (error, results, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            });
        }
    });
});

// Update Order (AJAX)
app.put('/update-order-ajax', function (req, res) {
    let data = req.body;

    let queryUpdateOrder = `
        UPDATE Orders 
        SET orderGiftNote = ?, orderCustomRequest = ?, orderStatus = ?, 
            orderShippedDate = ?, orderDeliveredDate = ?
        WHERE orderID = ?;
    `;

    db.pool.query(
        queryUpdateOrder,
        [data.orderGiftNote || null, data.orderCustomRequest || null, data.orderStatus, data.orderShippedDate || null, data.orderDeliveredDate || null, data.orderID],
        function (error, results, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(200);
            }
        }
    );
});

// View Order Products (AJAX)
app.get('/order-products/:orderID', function (req, res) {
    let orderID = req.params.orderID;

    let queryOrderProducts = `
        SELECT op.orderID, op.productID, p.productName, op.orderProductRequest, op.orderProductSalePrice
        FROM Order_Products op
        JOIN Products p ON op.productID = p.productID
        WHERE op.orderID = ?;
    `;

    db.pool.query(queryOrderProducts, [orderID], function (error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.json(rows);
        }
    });
});

// Add Order Product (AJAX)
app.post('/add-order-product-ajax', function (req, res) {
    let data = req.body;

    let queryAddOrderProduct = `
        INSERT INTO Order_Products (orderID, productID, orderProductRequest, orderProductSalePrice)
        VALUES (?, ?, ?, ?);
    `;

    db.pool.query(
        queryAddOrderProduct,
        [data.orderID, data.productID, data.orderProductRequest || null, data.orderProductSalePrice],
        function (error, results, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(200);
            }
        }
    );
});

// Delete Order Product (AJAX)
app.delete('/delete-order-product-ajax', function (req, res) {
    let data = req.body;

    let queryDeleteOrderProduct = `
        DELETE FROM Order_Products WHERE orderID = ? AND productID = ?;
    `;

    db.pool.query(queryDeleteOrderProduct, [data.orderID, data.productID], function (error, results, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

// Update Order Product (AJAX)
app.put('/update-order-product-ajax', function (req, res) {
    let data = req.body;

    let queryUpdateOrderProduct = `
        UPDATE Order_Products 
        SET orderProductRequest = ?, orderProductSalePrice = ?
        WHERE orderID = ? AND productID = ?;
    `;

    db.pool.query(
        queryUpdateOrderProduct,
        [data.orderProductRequest || null, data.orderProductSalePrice, data.orderID, data.productID],
        function (error, results, fields) {
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(200);
            }
        }
    );
});
    
/*
    LISTENER
*/
app.listen(PORT, function()                     // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
{            
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
