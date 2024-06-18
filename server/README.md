

# Technologies
This is the backend, and uses an Express server and Prisma ORM to interact with a PostgreSQL server hosted on Neon.
Credentials for the Neon database are in the Final Report of Spring 2024 (MUST READ).

# Getting started
* cd server
* npm install (via package.json)
* npx prisma run (1st time)
* npx prisma generate (1st time and when prisma changes)
* npm run build (script - always)
* npm run start - to launch express (script -always)
* * npm run dev - nodemon watchmode
****Full script in package.json

API Calls:
* before you make any API calls, you should probably make the .env file and put the database url in there provided by the Final Report 
* install postmann
* You can find the api calls (Post method) in the router folder here
* Fire POST requests in Postman to localhost:{port}{route}
* * Ex: POST: localhost:8000/item/get


# New to development?
* dist folder: houses the JavaScript equivilant of the src folder. Does not exist when you pull, but is created thanks to a script when you "npm run build." It is ignored in the global .gitignore. 
* helpers: supplementary files with functions and constants (empty)
* prisma: contains the schema of the PostgreSQL database. Is the ORM you used to interact with the db.
* router: express router that routes calls to certain services. The router itself lives in index.ts of the router folder.
* * all substantial files are routes that will take the router in as an argument, until the request finds a match
* db: contains all the methods that use prisma to operate on each table in the database. Each file contains the table's CRUD. Exported and used in services
* services: uses the methods in db but also does a lot of the extra computing with Request and Response on each table
* the topmost level "server.ts" is the actual express server. 



