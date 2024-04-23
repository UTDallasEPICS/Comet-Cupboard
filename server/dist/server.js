"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
//Routing is done with CSR - React Router
//This server, the backend of Comet Cupboard, is primarily used to fetch and store data on the database.
//Later, it will also be used to handle cookies and authentication
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// const app: Express = express();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // const students = await prisma.student.findMany();
        // console.log(students) //Prints all the students in student table
        // ... you will write your Prisma Client queries here
        //npx ts-node src/server.ts unless in this directory
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
