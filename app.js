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

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

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


    // CUSTOMERS PAGE START

    app.get('/customers', function(req, res)
    {  
        let selectCustomers = "SELECT * FROM Customers;";               // Define our query
    });

    //Customers page
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
