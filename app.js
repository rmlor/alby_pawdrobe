/*
    SETUP
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
    API Routes - Provide JSON Data
*/

// Addresses
app.get('/api/addresses', (req, res) => {
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

// Dogs
app.get('/api/dogs', (req, res) => {
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

// Products

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

app.post('/api/products/add', (req, res) => {            
    console.log('Payload received:', req.body);    
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
    UI Routes - Render Pages
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
            console.error("Error fetching orders:", error);
            return res.status(500).json({error: "Failed to fetch orders"}); // JSON for errors
        }
        res.render('orders', {data: results});
    });
});

/*
    Listener
*/

app.listen(PORT, () => {
    console.log(`Express started on http://localhost:${PORT}; press Ctrl-C to terminate.`);
});
