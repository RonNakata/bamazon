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
    // run the start function after the connection is made, to prompt the user
    dispInv();
});

function dispInv() {
    // grab everything in the products table & display some of it nicely, then ask the customer Q's
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        console.log("\n---------------------------------------------")
        console.log("| ID     | Name                    | Price  |        ")
        console.log("---------------------------------------------")
        for (var i = 0; i < res.length; i++) {
            console.log(
                "| " +
                res[i].item_id + padID(res[i].item_id) +
                "| " +
                res[i].product_name + padName(res[i].product_name) +
                "| " +
                res[i].price + padPrice(res[i].price) + "|"
            );
        };
        console.log("---------------------------------------------")
        askQ();
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
    for (var i = (7 - val.toString().length); i > 0; i--) {
        pad = pad + " ";
    }
    return pad;
};


function askQ() {
    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "What is the ID of the product you would like to buy?"
            },
            {
                name: "units",
                type: "input",
                message: "How many units of the product would you like to buy?"
            }
        ])
        .then(function (answer) {
            var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE item_id=" + answer.id;
            connection.query(query, function (err, res) {
                if (err) throw err;
                if (res[0].stock_quantity < parseInt(answer.units)) {
                    console.log("Sorry we have an insufficient quantity of " + res[0].product_name + " to process your order.")
                    connection.end();
                }
                else {
                    console.log("\nProcessing order");
                    console.log("****************");
                    newQuant = (res[0].stock_quantity - parseInt(answer.units));
                    fulfil(answer.id, newQuant);
                    console.log("You purchased " + answer.units + " units of " + res[0].product_name + ".");
                    var cost = (parseInt(answer.units) * res[0].price);
                    console.log("Your total cost was: $" + cost.toFixed(2));
                    connection.end();
                }
            });
        });
};

function fulfil(id, quant) {
    var query = "UPDATE products SET stock_quantity=" + quant + " WHERE item_id=" + id;
    connection.query(query, function (err) {
        if (err) throw err;
        else {
            console.log("__________________________");
            console.log("Remaining quantity updated");
        }
    });
}