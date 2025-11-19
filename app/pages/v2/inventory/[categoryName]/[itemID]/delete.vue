<template lang="pug">
div.flex.flex-col.items-center.justify-center.gap-y-8 
    V2SharedStatusMessageWarning(warningMessage="This item will be permanently deleted from the database!" class="absolute top-20")
    div.bg-white.w-96.h-80.rounded-xl.flex.flex-col.gap-3.drop-shadow-standard.items-center.justify-center.relative.overflow-hidden 
        // Delete confirmation text
        div.flex.flex-col.items-center.justify-center.text-center.px-8 
            p.text-3xl.text-black.font-normal Are you sure you want to delete
            p.text-4xl.text-black.font-bold {{ itemName }}
            p.text-3xl.text-black.font-normal ?
    div.flex.flex-row.gap-x-10.mt-24
        button(@click="goBack").bg-cupboardv2-dg.w-48.h-16.rounded-xl.flex.items-center.justify-center.drop-shadow-standard.relative
            p.text-white.text-3xl.font-bold Cancel
        button(@click="deleteItemSubmit").bg-utd-orange.w-48.h-16.rounded-xl.flex.items-center.justify-center.drop-shadow-standard.relative
            p.text-white.text-3xl.font-bold Yes, Delete
</template>

<script lang="ts" setup>
import { useRoute, navigateTo } from '#imports' 

const emit = defineEmits(["submit"])
const route = useRoute()
const currentCategory = route.params.categoryName as string
const itemID = route.params.itemID as string

// Fetch item data based on route
const { data: item } = await useFetch(`/api/inventory/item`, {
    params: { itemID }
})

const itemName = computed(() => item.value?.name ?? "")

const toggleDeleteItem = () => {
    emit("submit")
}

const deleteItemSubmit = async () => {
    if(!item.value) return 

    await $fetch("/api/inventory/item", {
        method: "DELETE",
        body: { itemID: item.value.itemID },
    })

    toggleDeleteItem()

    navigateTo(`/v2/inventory/${currentCategory}`)
}

// Goes back to the inventory page for the current category
const goBack = () => {
    navigateTo(`/v2/inventory/${currentCategory}`)
}
</script>