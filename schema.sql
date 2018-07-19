DROP DATABASE IF EXISTS bamazonDB;
CREATE database bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  item_id INT(7) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(24) NOT NULL,
  department_name VARCHAR(12) NOT NULL,
  price DECIMAL(7,2) NOT NULL,
  stock_quantity INT(5) NOT NULL,
  PRIMARY KEY (item_id)
);
