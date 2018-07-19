// Load the NPM Package inquirer
var inquirer = require("inquirer");
// Load mysql package
var mysql = require("mysql");

// set up the connection to the sql db
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazondb"
});

connection.connect(function (err) {
    if (err) throw err;
    // run the menu function after the connection is made, to prompt the user
    theMenu();
});

// Global variable to check if low inventory is to be displayed
var lowInv = false;


// Function to prompt before going back to menu or quitting
function backTo() {
    inquirer
        .prompt([
            {
                type: "confirm",
                message: "Go back to the menu?:",
                name: "confirm",
                default: true
            }
        ])
        .then(function (answer) {
            if (answer.confirm) {
                theMenu();
            }
            else {
                connection.end();
            }
        });
}


function theMenu() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "selection",
                message: "Welcome Manager, please make a choice: ",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
            }
        ])
        .then(function (answer) {
            switch (answer.selection) {
                case "View Products for Sale":
                    viewProducts();
                    break;
                case "View Low Inventory":
                    lowInv = true;
                    viewProducts();
                    break;
                case "Add to Inventory":
                    addInv();
                    break;
                case "Add New Product":
                    addProd(); break;
            }
        });
};

function viewProducts() {
    // Logic to see if low inventory should be displayed
    if (lowInv) {
        lowInv = false;
        console.log("\nDisplaying low inventory where quantity is less than 5.")
        var query = "SELECT * FROM products WHERE stock_quantity<5";
    }
    else {
        var query = "SELECT * FROM products";
    }
    // * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.
    connection.query(query, function (err, res) {
        console.log("\n---------------------------------------------------------")
        console.log("| ID     | Name                    | Price   | Quantity |")
        console.log("---------------------------------------------------------")
        for (var i = 0; i < res.length; i++) {
            console.log(
                "| " +
                res[i].item_id + padID(res[i].item_id) +
                "| " +
                res[i].product_name + padName(res[i].product_name) +
                "| " +
                res[i].price + padPrice(res[i].price) +
                "| " +
                res[i].stock_quantity + padQuant(res[i].stock_quantity) +
                "|"
            );
        };
        console.log("---------------------------------------------------------")
        backTo();
    });
};

// Functions to add spaces when displaying the inventory
function padID(val) {
    var pad = "";
    for (var i = (7 - val.toString().length); i > 0; i--) {
        pad = pad + " ";
    }
    return pad;
};
function padName(val) {
    var pad = "";
    for (var i = (24 - val.length); i > 0; i--) {
        pad = pad + " ";
    }
    return pad;
};
function padPrice(val) {
    var pad = "";
    for (var i = (8 - val.toString().length); i > 0; i--) {
        pad = pad + " ";
    }
    return pad;
};
function padQuant(val) {
    var pad = "";
    for (var i = (9 - val.toString().length); i > 0; i--) {
        pad = pad + " ";
    }
    return pad;
};

// Function to add to the inventory, aka update quantity on an item

function addInv() {
    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "What is the ID of the product you want to add to?"
            },
            {
                name: "units",
                type: "input",
                message: "How many units of the product would you like add?"
            }
        ])
        .then(function (answer) {
            connection.query(
                "SELECT * FROM products WHERE item_id=" + answer.id, function (err, res) {
                    if (err) throw err;
                    console.log("Increasing quantity of " + res[0].product_name + " by " + answer.units);
                    var newInv = (res[0].stock_quantity + parseInt(answer.units));
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: newInv
                            },
                            {
                                item_id: answer.id
                            }
                        ],
                        function (error) {
                            if (error) throw error;
                            console.log("Update succesful");
                            backTo();
                        }
                    );
                }
            );
        });
}

// Function to add a new product to the inventory
function addProd() {
    inquirer
        .prompt([
            {
                name: "product_name",
                type: "input",
                message: "What is the name of the new product you want to add?"
            },
            {
                name: "department_name",
                type: "input",
                message: "What department does the new product fall under?"
            },
            {
                name: "price",
                type: "input",
                message: "What is the price of the new product?"
            },
            {
                name: "stock_quantity",
                type: "input",
                message: "How many units of the new product are being added to the inventory?"
            }
        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.product_name,
                    department_name: answer.department_name,
                    price: answer.price,
                    stock_quantity: answer.stock_quantity
                },
                function (err) {
                    if (err) throw err;
                    console.log("You have successfully added " + answer.product_name + " to the inventory.");
                    backTo();
                }
            );
        });
}