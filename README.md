# bamazon
Like amazon but with a b

# Customer experience: 

run bamazonCustomer.js with node in your console ![1](img/1.png)

It will connect to a mysql db,
Displays some of the db info &
Prompts for the item & quantity you want to purchase ![2](img/2.png)

After entering the info, it will either make the purchase and advise how much you spent,![3](img/3_success.png) 
or advise there is insufficient quantity ![3](img/3_fail.png)

# Manager experience

run bamazonManager.js with node in your console  ![4](img/4.png)

It will connect to a mysql db,
&
prompt you to take some actions ![5](img/5.png)

Select view products, and it will display the products ![6](img/6.png)

Select view low inventory, and it will display items with quantity less than 5 ![7](img/7.png)

Select add to inventory, and it will propmt you to enter the id of an item and the quantity you want to add ![8](img/8_before.png) ![8](img/8.png) ![8](img/8_after.png)

Select Add new product, and it will prompt you for the necessary data to add a new product, then add it ![9](img/9.png)

