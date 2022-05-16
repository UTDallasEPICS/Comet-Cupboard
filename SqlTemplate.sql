CREATE SCHEMA CometCupboard;

# Create Table statements
CREATE TABLE Users (
	Netid	CHAR(9),
    Fname	VARCHAR(15),
    Lname	VARCHAR(15),
    Isadmin	BOOL,
    
    PRIMARY KEY(Netid)
);

CREATE TABLE CategoryType (
	Tid	INT	AUTO_INCREMENT,
    Tname	VARCHAR(35),
    
    PRIMARY KEY(Tid)
);

CREATE TABLE Product (
	Pid	INT	AUTO_INCREMENT,
    Quantity	INT,
    Volunteerid	CHAR(9),
    Category	ENUM('Breakfast', 'Canned fruit', 'Meat', 'Refrigerated items', 
    'Canned vegetables', 'Soup', 'Grains', 'Personal care', 'Frozen items', 
    'Beverages', 'Pantry staples', 'Snacks', 'Household items',
    'Beans and lentils', 'Misc'),
    Cattypeid	INT,
    Donor	VARCHAR(35),
    Locationstored	VARCHAR(35),
    
    PRIMARY KEY(Pid),
    FOREIGN KEY(Volunteerid) REFERENCES Users(Netid),
    FOREIGN KEY(Cattypeid) REFERENCES CategoryType(Tid)
);

# Insertion Queries
INSERT INTO CategoryType VALUES(101, 'Oatmeal');
INSERT INTO CategoryType(Tname) VALUES('Pastry');

INSERT INTO Users VALUES('JHS200000', 'John', 'Smythe', FALSE);

INSERT INTO Product(Quantity, Volunteerid, Category, Cattypeid, Donor, Locationstored) 
VALUES(20, 'JHS200000', 'Breakfast', 101, 'Donor1', 'Location1');

INSERT INTO Product(Quantity, Volunteerid, Category, Cattypeid, Donor, Locationstored) 
VALUES(20, 'JHS200000', 'Breakfast', 102, 'Donor1', 'Location1');

INSERT INTO Product(Quantity, Volunteerid, Category, Cattypeid, Donor, Locationstored) 
VALUES(20, 'JHS200000', 'Breakfast', 102, 'Donor2', 'Location2');

# Retrieval Queries
SELECT * FROM Product;
SELECT * FROM CategoryType;
SELECT * FROM Users;

SELECT Tname, Quantity, Locationstored
FROM (Product JOIN CategoryType ON Cattypeid = Tid)
WHERE Category = 'Breakfast';
