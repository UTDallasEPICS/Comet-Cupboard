import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getItems = async () => { //Returns a list of all items
    const items = await prisma.item.findMany();
    return items;
};

export const getItemsByCategory = async (classification: string) => {
    const item = await prisma.item.findMany({ //Returns list of all items that match category
        where: {
            classification, 
        },
    })
    return item;

};

export const addNewItem = async () => {

};

export const deleteItem = async () => { 

}

export const updateItem = async () => {

}

