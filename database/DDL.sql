/*
Project: Alby's Custom Pawdrobe Solutions
Phase: (3) Data Definition Language and Sample Data Insertion
Group: 89
Members: Ruth Lor, Nhu Dang

Course: CS340 - Introduction to Database

Description: 
This SQL file contains the Data Definition Language (DDL) and sample data insertion for Alby's Custom Pawdrobe, a boutique business specializing in custom-designed clothing for dogs. 
The file creates all necessary tables with primary and foreign keys, along with sample data that represent customers, their dogs (and breeds), product catalog, orders, and customizations.

Tables:
1. Customers
2. Addresses
3. Dogs
4. Breeds
5. Dog_Breeds (intersection table)
6. Products
7. Orders
8. Order_Products (intersection table)
*/

-- file set-up --
SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;
DROP TABLE IF EXISTS Customers, Addresses, Dogs, Breeds, Dog_Breeds, Products, Orders, Order_Products;

-- data definition language --
-- define Customers entity
CREATE TABLE `Customers`(
    `customerID` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `customerName` VARCHAR(50) NOT NULL,
    `customerEmail` VARCHAR(255) NOT NULL UNIQUE,
    `customerPhone` VARCHAR(15) NOT NULL UNIQUE
);

-- define Addresses entity
CREATE TABLE `Addresses`(
    `addressID` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `customerID` INT(11) UNSIGNED DEFAULT NULL,
    `addressLabel` VARCHAR(15) NOT NULL,
    `streetAddress` VARCHAR(50) NOT NULL,
    `unit` VARCHAR(50) DEFAULT NULL,
    `city` VARCHAR(50) NOT NULL,
    `state` VARCHAR(2) NOT NULL,
    `postalCode` VARCHAR(15) NOT NULL,
    FOREIGN KEY (`customerID`) REFERENCES `Customers`(`customerID`) 
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- define Dogs entity
CREATE TABLE `Dogs`(
    `dogID` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `customerID` INT(11) UNSIGNED DEFAULT NULL,
    `dogName` VARCHAR(50) NOT NULL,
    `upperNeckGirthIn` INT(11) NOT NULL,
    `lowerNeckGirthIn` INT(11) NOT NULL,
    `chestGirthIn` INT(11) NOT NULL,
    `backLengthIn` INT(11) NOT NULL,
    `heightLengthIn` INT(11) NOT NULL,
    `pawWidthIn` DECIMAL(2,1) NOT NULL,
    `pawLengthIn` DECIMAL(2,1) NOT NULL,
    FOREIGN KEY (`customerID`) REFERENCES `Customers`(`customerID`) 
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- define Breeds entity
CREATE TABLE `Breeds`(
    `breedID` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `breedName` VARCHAR(50) NOT NULL,
    `breedCoatType` ENUM(
        'Short', 
        'Long', 
        'Hairless', 
        'Curl', 
        'Wire', 
        'Fluffy', 
        'Combination'
    ) NOT NULL,
    `breedShedLevel` ENUM(
        'High', 
        'Moderate', 
        'Low'
    ) NOT NULL
);

-- define Dog_Breeds entity
CREATE TABLE `Dog_Breeds`(
    `dogBreedID` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `dogID` INT(11) UNSIGNED DEFAULT NULL,
    `breedID` INT(11) UNSIGNED DEFAULT NULL,
    FOREIGN KEY (`dogID`) REFERENCES `Dogs`(`dogID`) 
    ON DELETE SET NULL
    ON UPDATE CASCADE,
    FOREIGN KEY (`breedID`) REFERENCES `Breeds`(`breedID`) 
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- define Products entity
CREATE TABLE `Products`(
    `productID` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `productName` VARCHAR(50) NOT NULL,
    `productDescription` VARCHAR(255) NOT NULL,
    `productType` ENUM(
        'Bandana',
        'Sock',
        'Shirt',
        'Sweater',
        'Jacket',
        'Hoodie',
        'Coat',
        'Pajama',
        'Tuxedo',
        'Dress',
        'Bodysuit'
    ) NOT NULL,
    `productColorBase` VARCHAR(50) NOT NULL,
    `productColorStyle` ENUM(
        'Standard',
        'Pastel',
        'Rich',
        'Metallic',
        'Matte'
    ) NOT NULL,
    `productLiningMaterial` ENUM(
        'Cotton',
        'Polyester',
        'Denim',
        'Nylon',
        'Wool',
        'Fleece'
    ) NOT NULL,
    `productFillingMaterial` ENUM(
		'Polyester', 
        'Down', 
        'Cotton'
	) DEFAULT NULL,
    `productBasePrice` DECIMAL(8, 2) NOT NULL
);

-- define Orders entity
CREATE TABLE `Orders`(
    `orderID` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `dogID` INT(11) UNSIGNED DEFAULT NULL,
    `addressID` INT(11) UNSIGNED DEFAULT NULL,
    `orderDate` DATE NOT NULL,
    `orderGiftNote` VARCHAR(255) DEFAULT NULL,
    `orderCustomRequest` ENUM(
        'gift_wrap',
        'rush_order',
        'sustainable_pack'
    ) DEFAULT NULL,
    `orderStatus` ENUM(
        'received',
        'preparing',
        'packing',
        'shipped',
        'delivered',
        'delayed',
        'canceled',
        'returned'
    ) NOT NULL,
    `orderShippedDate` DATE DEFAULT NULL,
    `orderDeliveredDate` DATE DEFAULT NULL,
    FOREIGN KEY (`dogID`) REFERENCES `Dogs`(`dogID`) 
    ON DELETE SET NULL
    ON UPDATE CASCADE,
    FOREIGN KEY (`addressID`) REFERENCES `Addresses`(`addressID`) 
    ON DELETE SET NULL
    on UPDATE CASCADE
);

-- define Order_Products entity
CREATE TABLE `Order_Products`(
    `orderProductID` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `orderID` INT(11) UNSIGNED DEFAULT NULL,
    `productID` INT(11) UNSIGNED DEFAULT NULL,
    `orderProductRequest` VARCHAR(255) NULL,
    `orderProductSalePrice` DECIMAL(8, 2) NOT NULL,
    FOREIGN KEY (`orderID`) REFERENCES `Orders`(`orderID`) 
    ON DELETE SET NULL
    ON UPDATE CASCADE,
    FOREIGN KEY (`productID`) REFERENCES `Products`(`productID`) 
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- sample data insertion --
-- insert sample data into Customers table
INSERT INTO Customers (customerName, customerEmail, customerPhone)
VALUES 
	('Ebenezer Scrooge', 'scrooge@me.com', '678-123-3344'),
    ('Jack Skellington', 'skellington@me.com', '978-444-1144'),
    ('Santa Claus', 'claus@me.com', '869-001-2612');

-- insert sample data into Addresses table
INSERT INTO Addresses (customerID, streetAddress, unit, city, state, postalCode)
VALUES 
	(1,'7200 Madelynne Dr', 'Apt 1', 'Anchorage', 'AK', '99504'),
    (2, '82 Old York Dr', NULL, 'Lindenhurst', 'NY', '11757'),
    (3, '77 Pine Court', NULL, 'Akron', 'OH', '44312'),
    (1, '99 Candle Street', 'Unit 206', 'Wichita', 'KS', '67203');

-- insert sample data into Dogs table
INSERT INTO Dogs (customerID, dogName, upperNeckGirthIn, lowerNeckGirthIn, chestGirthIn, backLengthIn, heightLengthIn, pawWidthIn, pawLengthIn)
VALUES
	(1, 'Alby', 9, 12, 18, 14, 9, 2.5, 3.0),					-- belongs to Ebenezer Scrooge
    (1, 'Sadie', 17, 21, 36, 25, 22, 3.0, 3.5),					-- belongs to Ebenezer Scrooge
    (2, 'Mochi', 18, 16, 36, 60, 75, 7.0, 8.0),					-- belongs to Jack Skellington
    (3, 'Bean', 15, 14, 32, 45, 40, 6.0, 7.0);					-- belongs to Santa Claus

-- insert sample data into Breeds table
INSERT INTO Breeds (breedName, breedCoatType, breedShedLevel)
VALUES 
	('Shih Tzu', 'Fluffy', 'Low'),
    ('Golden Retriever', 'Short', 'High'),
    ('German Shepherd', 'Short', 'High'),
    ('Bulldog', 'Short', 'Moderate'),
    ('Corgi', 'Short','High');
    
-- insert sample data into Dog_Breeds table
INSERT INTO Dog_Breeds (dogID, breedID)
VALUES
	(1, 1),													-- Alby is a Shih Tzu
    (2, 2),													-- Sadie is a Golden Retriever
    (3, 3),													-- Mochi is a German Shepherd
    (4, 4),													-- Bean is a mixed Bulldog
    (4, 5);													-- Bean is a mixed Corgi

-- insert sample data into Products table
INSERT INTO Products (productName, productDescription, productType, productColorBase, productColorStyle, productLiningMaterial, productFillingMaterial, productBasePrice)
VALUES
	('Snuggle Suit', 'Soft cotton bodysuit for all-day cuddles', 'bodysuit', 'blue', 'standard', 'cotton', NULL, 30.00),
    ('Reversible Puffer', 'Stylish reversible puffer for warmth and whimsies', 'jacket', 'black & pink', 'metallic', 'nylon', 'polyester', 50.00),
    ('Classic Tux', 'Elegant silk tuxedo, perfect for formal occasions', 'tuxedo', 'black & white', 'standard', 'polyester', NULL, 45.00),
    ('Itsy Rain Coat', 'Lightweight raincoat to keep your pup dry', 'coat', 'yellow', 'matte', 'nylon', NULL, 38.00),
    ('Barkmas Tree Fleece PJs', 'Fleece pajamas with Christmas Tree print for your pup to cozy up', 'pajama', 'green', 'pastel', 'fleece', NULL, 30.00);

-- insert sample data into Orders table
INSERT INTO Orders (dogID, addressID, orderDate, orderGiftNote, orderCustomRequest, orderStatus, orderShippedDate, orderDeliveredDate)
VALUES
	(1, 1, '2024-10-01', 'Happy Birthday Alby <3', 'gift_wrap', 'delivered', '2024-10-05', '2024-10-06'),		-- order for Alby
    (2, 4, '2024-10-02', NULL, 'rush_order', 'delivered', '2024-10-03', '2024-10-04'),					        -- order for Sadie
    (3, 2, '2024-10-05', NULL, 'sustainable_pack', 'delayed', 2024-10-09, NULL),					            -- order for Mochi
    (4, 3, '2024-10-08', 'Enjoy the cozy PJs, Bean!', 'gift_wrap', 'preparing', NULL, NULL);				    -- order for Bean

-- insert sample data into Order_Products table
INSERT INTO Order_Products (orderID, productID, orderProductRequest, orderProductSalePrice)
VALUES
	(1, 1, 'Add daisy-themed buttons and lace', 42.50),								-- product #1 (comfy bodysuit) in order #1 (for Alby)
    (1, 2, 'Embroider "Alby" in cursive', 62.00),									-- product #2 (puffer jacket) in order #1 (for Alby)
    (2, 2, NULL, 69.00),												-- product #2 (puffer jacket) in order #2 (for Sadie)
    (3, 3, 'Add Dracula cape, make fit oversized', 55.00),								-- product #3 (cosplay tuxedo) in order #3 (for Mochi)
    (4, 5, 'Embroider small, angel patterns', 45.00);									-- product #5 (cozy pj) in order #4 (for Bean)
    
-- file wrap-up --
-- re-enable foreign key checks and autocommit
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
SET AUTOCOMMIT = 1;
