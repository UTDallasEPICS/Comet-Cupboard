# To-Do
The purpose of the Comet Cupboard Inventory is to
- Provide a streamline view of the inventory of the food pantry
- Faciliate Add/Removal of inventory items through transactions (Catalogue and Cart page) and restocking (Inventory) 
- Provide analytics for the admin about: (North Bank Student Form)
- - Student demographics (major, age, grade and activity at Comet Cupboard (how many times a week? Last visit?))
- - Item statistics (popularity, amount/wk, expired on shelve if any)
Three views: Faculty, Staff, Student
Pages: Checkout Page (Cashier), Inventory Page, Catologue Page, and Cart Page.
Faculty: Sees Inventory Page, Checkout Page, Catologue Page, Donors Page, North Bank Form Page, and Student Information Page
Staff: Sees Inventory Page, Checkout Page, Catologue Page, Cart Page, and North Bank Form Page
Student: Sees Catlogue Page, North Bank Form Page, and Cart Page


# Technologies
Backend: Express Server, Prisma ORM, PostgreSQL (on Neon db)
Credentials and database url for the Neon database are in the Final Report of Spring 2024 (MUST READ).

FrontEnd: React TypeScript, Mui

# Getting started
Backend
* cd server
* npm install (via package.json)
* npx prisma run (1st time)
* npx prisma generate (1st time)
* npm run build (script)
* npm run start - to launch express (script)
* * npm run dev - nodemon watchmode
****Full script in package.json

Frontend:

* cd ui
* npm install (via package.json)
* npm install @mui/material @emotion/react @emotion/styled
  npm install @mui/icons-material


API Calls:
* install postmann
* You can find the api calls (Post method) in the router folder here
* Fire POST requests in Postman to localhost:{port}{route}
* * Ex: POST: localhost:8000/item/get

# Some Functionality Psuedocode
Checkout Page: 
Always querying the database's "carts table" and displays a row of `netID | itemsList` for carts that have been finalized. There is a green checkout button at the end of the row.

Inventory Page:
Query the database's "item table" and prints a view of all items throughout the history. Has a CREATE button at the top that creates a new row in the item table. Create is going to be hard because we also have to allow staff to upload an image for the item.
 Also each row displayed on the frontend would have a "MODIFY" option that modifies the database. There is also a "DELETE" option which would delete the corresponding row in the database. Looks like "Modify | Delete" per every row displayed.

Catologue Page:
For every item that has stock > 0, display their card. Card is the square graphic that has the image, name of the item, category of the item, and a +/- quantity slider.
Sort by ABC or ZYX.
The same logic is applied when they click a specific category but with the extra condition that they match the category. 

Cart Page:
Fullscreen view of the current cart, which is queried from the carts db for a cart that belongs to the studentID of the student. Should have an "empty cart" option which would delete the cart from the carts and the cart table in the database. Deleting or updating the quantity will also be operations done on the cart table. There should be a big green "CHECKOUT" button, which once clicked, sends the cart to the Checkout Page which the staff sees. While the student is waiting for someone to verify their stuff, there should be a screen of "Waiting...." and then "All set" once the staff signs on their end.




                





