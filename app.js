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

/*
    ROUTES
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

    app.get('/orders', function(req, res)           //Fetch Orders
    {
        //Define query
        let queryOrders = `
            SELECT orderID, dogID, addressID, orderDate, orderGiftNote, 
                orderCustomRequest, orderStatus, orderShippedDate, orderDeliveredDate
            FROM Orders;
        `;
    
        //Execute query
        db.pool.query(queryOrders, (error, results, fields) => {
            res.render('orders', {data: results});
        });
    });
    
    //Products for a specific order (modal)        //Fetch Products by orderID
    app.get('/orders/:id/products', function (req, res) 
    {
        let orderId = req.params.id;
    
        let queryOrderProducts = `
            SELECT op.orderID, op.productID, p.productName, op.orderProductRequest, op.orderProductSalePrice
            FROM Order_Products op
            JOIN Products p ON op.productID = p.productID
            WHERE op.orderID = ?;
        `;
    
        db.pool.query(queryOrderProducts, [orderId], (error, products, fields) => {
            res.json(products); 
        });
    });
    
    //Add a product to an order
    app.post('/orders/:id/products/add', function(req, res) 
    {
        let orderId = req.params.id;
        let {productID, orderProductRequest, orderProductSalePrice} = req.body;
    
        let queryAddProductToOrder = `
            INSERT INTO Order_Products (orderID, productID, orderProductRequest, orderProductSalePrice)
            VALUES (?, ?, ?, ?);
        `;
    
        db.pool.query(queryAddProductToOrder, [orderId, productID, orderProductRequest, orderProductSalePrice], (err, results) => {
            res.redirect(`/orders`);
        });
    });
    
/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
