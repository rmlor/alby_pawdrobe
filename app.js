/*
    SETUP
*/

// Server
const express = require('express');
const app = express();
const PORT = 4189;

// Database
const db = require('./database/db-connector');

// App
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// Handlebars
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    API Routes - Provide JSON Data
*/

// Addresses API
app.get('/api/addresses', (req, res) => {
    const query= `
        SELECT 
            addressID AS id, 
            CONCAT(addressID, ': ', streetAddress, 
                   IF(unit IS NOT NULL AND unit != '', CONCAT(', ', unit), ''), 
                   ', ', city, ', ', state, ', ', postalCode) AS label 
        FROM Addresses`;

    db.pool.query(query, (error, results) => {
        if (error) {
            console.error("Error fetching addresses:", error);
            return res.status(500).json({ error: "Failed to fetch addresses" });
        }
        res.json(results);
    });
});

// Dogs API
app.get('/api/dogs', (req, res) => {
    const query = "SELECT dogID AS id, CONCAT(dogID, ': ', dogName) AS name FROM Dogs";
    db.pool.query(query, (error, results) => {
        if (error) {
            console.error("Error fetching dogs:", error);
            return res.status(500).json({ error: "Failed to fetch dogs" });
        }
        res.json(results);
    });
});

// Products API
app.get('/api/products', (req, res) => {
    const query = "SELECT productID AS id, CONCAT(productID, ': ', productName) AS name FROM Products";
    db.pool.query(query, (error, results) => {
        if (error) {
            console.error("Error fetching products:", error);
            return res.status(500).json({ error: "Failed to fetch products" }); // JSON for errors
        }
        res.json(results); // JSON for success
    });
});

// Orders API
app.get('/api/orders', (req, res) => {
    const query = `
        SELECT 
            orderID,
            dogID,
            addressID,
            orderDate,
            orderGiftNote,
            orderCustomRequest,
            orderStatus,
            orderShippedDate,
            orderDeliveredDate
        FROM Orders
    `;
    
    db.pool.query(query, (error, results) => {
        if (error) {
            console.error("Error fetching orders:", error);
            return res.status(500).json({ error: "Failed to fetch orders" }); // JSON for errors
        }
        res.json(results); // JSON for success
    });
});

app.post('/api/orders/add', (req, res) => {                 // ADD a new order
    const {
        dogID,
        addressID,
        orderDate,
        orderGiftNote,
        orderCustomRequest,
        orderStatus,
        orderShippedDate,
        orderDeliveredDate,
    } = req.body;

    const query = `
        INSERT INTO Orders (dogID, addressID, orderDate, orderGiftNote, orderCustomRequest, orderStatus, orderShippedDate, orderDeliveredDate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.pool.query(
        query,
        [dogID, addressID, orderDate, orderGiftNote || null, orderCustomRequest || null, orderStatus, orderShippedDate || null, orderDeliveredDate || null],
        (error, results) => {
            if (error) {
                console.error("Error adding order:", error);
                return res.status(500).json({ error: "Failed to add order" });
            }
            res.status(201).json({ message: "Order added successfully" });
        }
    );
});


// orderID from Orders API
app.get('/api/orders/:orderID', (req, res) => {
    const { orderID } = req.params;
    const query = "SELECT * FROM Orders WHERE orderID = ?";
    db.pool.query(query, [orderID], (error, results) => {
        if (error) {
            console.error("Error fetching order by ID:", error);
            return res.status(500).json({ error: "Failed to fetch order" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.json(results[0]); // Return the first (and only) result
    });
});

app.put('/api/orders/update/:orderID', (req, res) => {
    const { orderID } = req.params;
    const {
        addressID,
        orderGiftNote,
        orderCustomRequest,
        orderStatus,
        orderShippedDate,
        orderDeliveredDate,
    } = req.body;

    const query = `
        UPDATE Orders 
        SET addressID = ?, 
            orderGiftNote = ?, 
            orderCustomRequest = ?, 
            orderStatus = ?, 
            orderShippedDate = ?, 
            orderDeliveredDate = ? 
        WHERE orderID = ?
    `;

    db.pool.query(
        query,
        [addressID, orderGiftNote || null, orderCustomRequest || null, orderStatus, orderShippedDate || null, orderDeliveredDate || null, orderID],
        (error) => {
            if (error) {
                console.error("Error updating order:", error);
                return res.status(500).json({ error: "Failed to update order" });
            }
            res.status(200).json({ message: "Order updated successfully" }); // Send JSON response
        }
    );
});

app.delete('/api/orders/delete/:orderID', (req, res) => {
    const { orderID } = req.params;

    const query = "DELETE FROM Orders WHERE orderID = ?";
    db.pool.query(query, [orderID], (error, results) => {
        if (error) {
            console.error("Error deleting order:", error);
            res.status(500).send("Failed to delete order");
        } else if (results.affectedRows === 0) {
            // No rows were deleted, meaning the orderID doesn't exist
            res.status(404).send("Order not found");
        } else {
            res.sendStatus(200); // Successfully deleted
        }
    });
});


// Order_Products API
app.get('/api/orders/:orderID/products', (req, res) => {
    const { orderID } = req.params;
    const query = `
        SELECT 
            op.orderProductID, 
            op.orderID, 
            op.productID, 
            p.productName AS productName,
            op.orderProductRequest, 
            op.orderProductSalePrice
        FROM Order_Products op
        JOIN Products p ON op.productID = p.productID
        WHERE op.orderID = ?;
    `;

    db.pool.query(query, [orderID], (error, results) => {
        if (error) {
            console.error("Error fetching order products:", error);
            return res.status(500).json({ error: "Failed to fetch order products" });
        }
        res.json(results);
    });
});
app.get('/api/order-products/:orderProductID', (req, res) => {
    const { orderProductID } = req.params;
    const query = `
        SELECT 
            op.orderProductID, 
            op.orderID, 
            op.productID, 
            op.orderProductRequest, 
            op.orderProductSalePrice
        FROM Order_Products op
        WHERE op.orderProductID = ?;
    `;

    db.pool.query(query, [orderProductID], (error, results) => {
        if (error) {
            console.error("Error fetching order product:", error);
            return res.status(500).json({ error: "Failed to fetch order product" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Order product not found" });
        }
        res.json(results[0]); // Send the first result as the response
    });
});
app.post('/api/order-products/add', (req, res) => {
    const { orderID, productID, orderProductRequest, orderProductSalePrice } = req.body;

    const query = `
        INSERT INTO Order_Products (orderID, productID, orderProductRequest, orderProductSalePrice)
        VALUES (?, ?, ?, ?);
    `;

    db.pool.query(query, [orderID, productID, orderProductRequest || null, orderProductSalePrice], (error, results) => {
        if (error) {
            console.error("Error adding order product:", error);
            return res.status(500).json({ error: "Failed to add order product" });
        }
        res.status(201).json({ message: "Order product added successfully" });
    });
});

// orderProductID from Order_Products API
app.put('/api/order-products/update/:orderProductID', (req, res) => {
    const { orderProductID } = req.params;
    const { productID, orderProductRequest, orderProductSalePrice } = req.body;

    const query = `
        UPDATE Order_Products 
        SET productID = ?, 
            orderProductRequest = ?, 
            orderProductSalePrice = ? 
        WHERE orderProductID = ?;
    `;

    db.pool.query(query, [productID, orderProductRequest || null, orderProductSalePrice, orderProductID], (error) => {
        if (error) {
            console.error("Error updating order product:", error);
            return res.status(500).json({ error: "Failed to update order product" });
        }
        res.status(200).json({ message: "Order product updated successfully" });
    });
});

// DELETE a product from an order
app.delete('/api/order-products/delete/:orderProductID', (req, res) => {
    const { orderProductID } = req.params;

    const query = `
        DELETE FROM Order_Products WHERE orderProductID = ?;
    `;

    db.pool.query(query, [orderProductID], (error) => {
        if (error) {
            console.error("Error deleting order product:", error);
            return res.status(500).json({ error: "Failed to delete order product" });
        }
        res.sendStatus(200);
    });
});

/* 
    UI Routes - Render Pages
*/

// Home page 
app.get('/', (req, res) => {
    res.redirect('/orders');
});

// Orders page - Manage Orders


// Fetch dropdown data
app.get('/dogs', (req, res) => {
    const query = "SELECT dogID AS id, dogName AS name FROM Dogs";
    db.pool.query(query, (error, results) => {
        if (error) {
            console.error("Error fetching dogs:", error);
            return res.status(500).json({ error: "Failed to fetch dogs" });
        }
        res.json(results);
    });
});

app.get('/addresses', (req, res) => {
    const query = "SELECT addressID AS id, CONCAT(streetAddress, ', ', city) AS label FROM Addresses";
    db.pool.query(query, (error, results) => {
        if (error) {
            console.error("Error fetching addresses:", error);
            return res.status(500).json({ error: "Failed to fetch addresses" });
        }
        res.json(results);
    });
});

app.get('/products', (req, res) => {
    const query = "SELECT productID AS id, productName AS name FROM Products";
    db.pool.query(query, (error, results) => {
        if (error) {
            console.error("Error fetching products:", error);
            return res.status(500).json({ error: "Failed to fetch products" });
        }
        res.json(results);
    });
});
app.get('/orders', (req, res) => {
    const query = `
        SELECT * FROM Orders
    `;
    
    db.pool.query(query, (error, results) => {
        if (error) {
            console.error("Error fetching orders:", error);
            return res.status(500).json({ error: "Failed to fetch orders" }); // JSON for errors
        }
        res.render('orders', { data: results });
    });
});
// Listener
app.listen(PORT, () => {
    console.log(`Express started on http://localhost:${PORT}; press Ctrl-C to terminate.`);
});
