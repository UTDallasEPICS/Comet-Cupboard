<template lang="pug">
div.flex.flex-col.items-center.p-6.gap-3.lg_items-start.pt-10
    // Source Dropdown
    Listbox(v-model="selectedSource" v-slot="{ open }")
        div.relative
            ListboxButton.modal-button.flex.flex-row.w-80.bg-white.text-lg.text-cupboardv2-dg.px-4.items-center.text-left.font-normal.border-2.border-cupboardv2-lg
                div.grow
                    | {{ selectedSource || "Source" }}
                ChevronUpIcon(v-if="open").fill-cupboardv2-dg.stroke-cupboardv2-dg.h-7
                ChevronDownIcon(v-else).fill-cupboardv2-dg.stroke-cupboardv2-dg.h-7
            TransitionsDropDown
                ListboxOptions.absolute.top-14.bg-white.drop-shadow-standard.rounded-xl.w-full.max-h-36.divide-y.divide-cupboard-lg.overflow-y-auto.overscroll-contain.z-50
                    ListboxOption(
						v-for="source in sources"
						:key="source.name"
						:value="source.name"
					).p-1.text-center.text-lg.text-cupboardv2-dg.cursor-pointer.text-wrap.hover_bg-cupboardv2-lg
                        | {{ source.name }}   

    // Small Screens (Rectangle Cards), width scales and keeps a single column format
    div.flex.flex-col.gap-y-3.my-4.items-stretch.block.w-full.max-w-xl.mx-auto(v-if="displayRectangleCards")
        V2InventoryReviewCardRectangle(
			v-for="item in changedItems"
            :key="item.id"
			:imgName="item.imgName"
			:itemName="item.name"
            :itemCount="item.oldCount"
            :adjustedCount="item.newCount"
            class="w-full"
		)
    // Large Screens (Square Cards)
    div.my-4.w-full.mx-auto(
        :style='{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 250px))", gap: "1rem"}'
        v-if="displaySquareCards"
    )
       V2InventoryReviewCardSquare(
			v-for="item in changedItems"
            :key="item.id"
			:imgName="item.imgName"
			:itemName="item.name"
            :itemCount="item.oldCount"
            :adjustedCount="item.newCount"
		)

    // Footer Buttons
    div.flex.flex-row.gap-x-10.mt-32.lg_mt-0.lg_justify-end.lg_self-end
        button(@click="goBack").bg-cupboardv2-dg.w-48.h-16.rounded-xl.flex.items-center.justify-center.drop-shadow-standard
            p.text-white.text-3xl.font-bold Cancel
        button(@click="submit" :disabled="!selectedSource" :class="selectedSource ? 'bg-utd-orange' : 'bg-utd-orange/40 cursor-not-allowed'").w-48.h-16.rounded-xl.flex.items-center.justify-center.drop-shadow-standard
            p.text-white.text-3xl.font-bold Submit
</template>

<script lang="ts" setup>
import { CloudArrowUpIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/solid'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue"
import { useRoute, navigateTo } from '#imports' 
import { useInventoryStore } from '~/stores/useInventoryStore'

const route = useRoute()
const categoryName = route.params.categoryName as string
const selectedSource = ref<string | null>(null)
const { data: sources } = await useFetch("/api/controls/sources")
const inventoryStore = useInventoryStore()
const changedItems = computed(() => inventoryStore.changedItems)
const windowWidth = ref(0)

// --Page navigations for each button--
// Goes back to the inventory page for the current category
const goBack = () => {
    navigateTo(`/v2/inventory/${categoryName}`)
}

// Determining when to display rectangle cards and square cards
onMounted(() => {
    windowWidth.value = window.innerWidth 
    window.addEventListener("resize", () => {
        windowWidth.value = window.innerWidth
    })
})

// For rectangle cards
const displayRectangleCards = computed(() => windowWidth.value < 1024) // Width is less than 1024
// For square cards
const displaySquareCards = computed(() => windowWidth.value >= 1024) // Width is greater than or equal to 1024

watchEffect(() => {
    console.log("changedItems:", changedItems.value)
})

const submit = async () => {
    try {
        if(!selectedSource.value) return;

        const inventoryCountChanges = changedItems.value.map(item => ({
            itemID: item.id,
            countChange: item.newCount - item.oldCount
        }));

        await $fetch("/api/inventory/itemCountChanges", {
            method: "POST",
            body: {
                source: selectedSource.value,
                fieldMap: {},
                inventoryCountChanges,
            },
        });
        navigateTo(`/v2/inventory/${categoryName}`)
    } catch (error) {
        console.error("Error submitting item count changes:", error)
    }
};
</script>
