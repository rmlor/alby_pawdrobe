/*
    SETUP
*/

var express = require('express');                   // We are using the express library for the web server
var app     = express();                            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT        = 7560;                                 // Set a port number at the top so it's easy to change in the future
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

    // CUSTOMERS PAGE START

    app.get('/customers', function(req, res)
    {  
        let selectCustomers = "SELECT * FROM Customers;";               // Define our query

        db.pool.query(selectCustomers, function(error, rows, fields){    // Execute the query

            res.render('customers', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                
    });
    
    app.post('/add-customer-ajax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;

        console.log("Data being sent to server:", data);

        // Create the query and run it on the database
        insertCustomers = `INSERT INTO Customers (customerName, customerEmail, customerPhone) VALUES ('${data.customerName}', '${data.customerEmail}', '${data.customerPhone}')`;
        db.pool.query(insertCustomers, function(error, rows, fields){

            // Check to see if there was an error
            if (error) {

                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT * on Customers
                selectCustomers = `SELECT * FROM Customers;`;
                db.pool.query(selectCustomers, function(error, rows, fields){

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
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});