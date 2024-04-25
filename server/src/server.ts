//Routing is done with CSR - React Router
//This server, the backend of Comet Cupboard, is primarily used to fetch and store data on the database.
//Later, it will also be used to handle cookies and authentication
import { PrismaClient } from '@prisma/client'
import express, {Express, Request, Response} from "express"
import router from './router' // implementing this


const port: number = 8000;
const app: Express = express();

app.use("/", router());

app.listen(port, () => { 
    console.log(`Server started and listening on port ${port}`)
});

 