import { defineStore } from "pinia"

export const useInventoryStore = defineStore("inventory", {
    state: () => ({
        changedItems: [] as Array<{
            id: string
            oldCount: number,
            newCount: number
            name: string 
            imgName: string
        }>
    })
})