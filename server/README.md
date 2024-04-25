# To-Do

# Technologies
This is the backend, and uses an Express server and Prisma ORM to interact with a PostgreSQL server hosted on Neon.
Credentials for the Neon database are in the Final Report of Spring 2024 (MUST READ).

# Getting started
* cd server
* npm install (via package.json)
* npx prisma run (1st time)
* npx prisma generate (1st time)
* npm run build (script)
* npm run start - to launch express (script)
* * npm run dev - nodemon watchmode
****Full script in package.json

API Calls:
* install postmann
* You can find the api calls (Post method) in the router folder here
* Fire POST requests in Postman to localhost:{port}{route}
* * Ex: POST: localhost:8000/item/get


# New to development?
* dist folder: houses the JavaScript equivilant of server.ts
* helpers: supplementary files with functions and constants (empty)
* prisma: contains the schema of the PostgreSQL database


