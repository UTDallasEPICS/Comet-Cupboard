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




                





