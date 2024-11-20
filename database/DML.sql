-- MANDATORY ENTITIES --

-- queries for Customers --
-- INSERT
INSERT INTO Customers (customerName, customerEmail, customerPhone) 
VALUES (:name, :email, :phone);
-- SELECT
SELECT * FROM Customers;
-- UPDATE (customer contact info)
UPDATE Customers 
SET customerName = :newName,
    customerEmail = :newEmail,
    customerPhone = :newPhone
WHERE customerID = :customerID;
-- DELETE
DELETE FROM Customers WHERE customerID = :customerID;


-- queries for Addresses --
-- INSERT
INSERT INTO Addresses (customerID, streetAddress, unit, city, state, postalCode)
VALUES (:customerID, :streetAddress, :unit, :city, :state, :postalCode);
-- SELECT
SELECT Addresses.addressID, Addresses.customerID, Customers.customerName, Addresses.streetAddress, Addresses.unit, Addresses.city, Addresses.state, Addresses.postalCode
FROM Addresses
   INNER JOIN Customers ON Customers.customerID = Addresses.customerID;
-- UPDATE (address info)
UPDATE Addresses
SET customerID = :newCustomerID,
    streetAddress = :newStreetAddress,
    unit = :newUnit,
    city = :newCity,
    state = :newState,
    postalCode = :newPostalCode
WHERE addressID = :addressID;
-- DELETE
DELETE FROM Addresses WHERE addressID = :addressID;


-- querites for Dogs --
-- INSERT
INSERT INTO Dogs (customerID, dogName, upperNeckGirthIn, lowerNeckGirthIn, chestGirthIn, backLengthIn, heightLengthIn, pawWidthIn, pawLengthIn)
VALUES (:customerID, :dogName, :upperNeckGirthIn, :lowerNeckGirthIn, :chestGirthIn, :backLengthIn, :heightLengthIn, :pawWidthIn, :pawLengthIn);
-- SELLECT
SELECT Dogs.dogID, Dogs.customerID, Customers.customerName, Dogs.dogName, Dogs.upperNeckGirthIn, Dogs.lowerNeckGirthIn, Dogs.chestGirthIn, Dogs.backLengthIn, Dogs.heightLengthIn, Dogs.pawWidthIn, Dogs.pawLengthIn
FROM Dogs
   INNER JOIN Customers ON Customers.customerID = Dogs.customerID;
-- UPDATE (dog measurements from growth)
UPDATE Dogs
SET customerID = :newCustomerID, 
    dogName = :newDogName, 
    upperNeckGirthIn = :newUpperNeckGirthIn, 
    lowerNeckGirthIn = :newLowerNeckGirthIn, 
    chestGirthIn = :newChestGirthIn, 
    backLengthIn = :newBackLengthIn, 
    heightLengthIn = :newHeightLengthIn, 
    pawWidthIn = :newPawWidthIn, 
    pawLengthIn = :newPawLengthIn
WHERE dogID = :dogID;
-- DELETE
DELETE FROM Dogs WHERE dogID = :dogID;


--queries for Breeds
-- INSERT
INSERT INTO Breeds (breedName, breedCoatType)
VALUES (:breedName, :breedCoatType);
-- SELECT
SELECT * FROM Breeds;
-- UPDATE (breeds are unchangable, but update for mistake-correction purposes)
UPDATE Breeds
SET breedName = :newBreedName, 
    breedCoatType = :newCoatType
WHERE breedID = :breedID;
-- DELETE
DELETE FROM Breeds WHERE breedID = :breedID;


-- queries for Dog_Breeds (relationship table for a breed of a given dog) --
-- INSERT
INSERT INTO Dog_Breeds (dogID, breedID)
VALUES (:dogID, :breedID);
-- SELECT
SELECT * FROM Dog_Breeds;
-- UPDATE
UPDATE Dog_Breeds
SET breedID = :newBreedID
WHERE dogID = :dogID AND breedID = :oldBreedID;
-- DELETE
DELETE FROM Dog_Breeds WHERE dogBreedID = :dogBreedID;


-- queries for Products --
-- INSERT
INSERT INTO Products (productName, productDescription, productType, productColorBase, productColorStyle, productLiningMaterial, productFillingMaterial, productBasePrice)
VALUES (:productName, :productDescription, :productType, :productColorBase, :productColorStyle, :productLiningMaterial, :productFillingMaterial, :productBasePrice);
-- SELECT
SELECT * FROM Products;
-- UPDATE
UPDATE Products
SET productName = :newProductName, 
    productDescription = :newProductDescription, 
    productType = :newProductType, 
    productColorBase = :newProductColorBase, 
    productColorStyle = :newProductColorStyle, 
    productLiningMaterial = :newProductLiningMaterial, 
    productFillingMaterial = :newProductFillingMaterial, 
    productBasePrice = :newProductBasePrice
WHERE productID = :productID;
-- DELETE
DELETE FROM Products WHERE productID = :productID;


-- queries for Orders --
-- INSERT
INSERT INTO Orders (dogID, orderDate, orderGiftNote, orderCustomRequest, orderStatus, orderShippedDate, orderDeliveredDate) 
VALUES (:dogID, :orderDate, :giftNote, :customRequest, :status, :shippedDate, :deliveredDate);
-- SELECT 
SELECT Orders.*, Customers.customerName, Dogs.dogName 
FROM Orders 
LEFT JOIN Dogs ON Orders.dogID = Dogs.dogID
LEFT JOIN Customers ON Dogs.customerID = Customers.customerID;
-- UPDATE
UPDATE Orders 
SET orderDate = :newOrderDate, 
    orderGiftNote = :newGiftNote, 
    orderCustomRequest = :newCustomRequest, 
    orderStatus = :newStatus, 
    orderShippedDate = :newShippedDate, 
    orderDeliveredDate = :deliveredDate
WHERE orderID = :orderID;
-- DELETE
DELETE FROM Orders WHERE orderID = :orderID;


-- queries for Order_Products (relationship table for a product of a given order) --
-- INSERT
INSERT INTO Order_Products (orderID, productID, orderProductRequest, orderProductSalePrice) 
VALUES (:orderID, :productID, :productRequest, :salePrice);
-- SELECT 
SELECT Order_Products.*, Products.productName 
FROM Order_Products 
JOIN Products ON Order_Products.productID = Products.productID 
WHERE orderID = :orderID;
-- UPDATE 
UPDATE Order_Products 
SET orderProductRequest = :newProductRequest, 
    orderProductSalePrice = :newSalePrice
WHERE orderProductID = :orderProductID;
-- DELETE
DELETE FROM Order_Products WHERE orderProductID = :orderProductID;



-- OPTIONAL AGGREGATES --

-- query for customer order count on Home page
SELECT Customers.customerID, Customers.customerName, COUNT(Orders.orderID) AS orderCount
FROM Customers
LEFT JOIN Dogs ON Customers.customerID = Dogs.customerID
LEFT JOIN Orders ON Dogs.dogID = Orders.dogID
GROUP BY Customers.customerID
ORDER BY orderCount DESC
LIMIT 3;
-- query for customer order count on Customers page
SELECT Customers.customerID, Customers.customerName, Customers.customerEmail, Customers.customerPhone, COUNT(Orders.orderID) AS orderCount
FROM Customers
LEFT JOIN Dogs ON Customers.customerID = Dogs.customerID
LEFT JOIN Orders ON Dogs.dogID = Orders.dogID
GROUP BY Customers.customerID;

-- query for total sales/product on Home page
SELECT Products.productID, Products.productName, COUNT(Order_Products.orderID) AS salesCount
FROM Products
LEFT JOIN Order_Products ON Products.productID = Order_Products.productID
GROUP BY Products.productID
ORDER BY salesCount DESC
LIMIT 3;
-- query for total sales/product on Products page
SELECT Products.productID, Products.productName, Products.productDescription, Products.productType, Products.productColorBase, Products.productColorStyle, Products.productLiningMaterial, Products.productFillingMaterial, Products.productBasePrice, COUNT(Order_Products.orderID) AS salesCount
FROM Products
LEFT JOIN Order_Products ON Products.productID = Order_Products.productID
GROUP BY Products.productID;

-- query for breed composition on Home page
SELECT Breeds.breedID, Breeds.breedName, ROUND((COUNT(Dogs.dogID) * 100.0 / (SELECT COUNT(*) FROM Dogs)), 2) AS compositionPercent
FROM Breeds
LEFT JOIN Dog_Breeds ON Breeds.breedID = Dog_Breeds.breedID
LEFT JOIN Dogs ON Dog_Breeds.dogID = Dogs.dogID
GROUP BY Breeds.breedID
ORDER BY compositionPercent DESC
LIMIT 3;
-- query for breed composition on Breeds page
SELECT Breeds.breedID, Breeds.breedName, Breeds.breedCoatType, Breeds.breedShedLevel, ROUND((COUNT(Dogs.dogID) * 100.0 / (SELECT COUNT(*) FROM Dogs)), 2) AS compositionPercent
FROM Breeds
LEFT JOIN Dog_Breeds ON Breeds.breedID = Dog_Breeds.breedID
LEFT JOIN Dogs ON Dog_Breeds.dogID = Dogs.dogID
GROUP BY Breeds.breedID;

