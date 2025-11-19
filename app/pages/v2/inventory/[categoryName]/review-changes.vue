<template lang="pug">
div.flex.flex-col.items-center.p-6.gap-6
    // Source Dropdown
    Listbox(v-model="selectedSource" v-slot="{ open }")
        div.relative
            ListboxButton.modal-button.flex.flex-row.w-80.bg-white.text-lg.text-cupboardv2-dg.px-4.items-center.text-left.font-normal.border-2.border-cupboardv2-lg
                div.grow
                    | {{ selectedSource || "Category" }}
                ChevronUpIcon(v-if="open").fill-cupboardv2-dg.stroke-cupboardv2-dg.h-7
                ChevronDownIcon(v-else).fill-cupboardv2-dg.stroke-cupboardv2-dg.h-7
            TransitionsDropDown
                ListboxOptions.absolute.top-14.bg-white.drop-shadow-standard.rounded-xl.w-full.max-h-36.divide-y.divide-cupboard-lg.overflow-y-auto.overscroll-contain
                    ListboxOption(
						v-for="source in sources"
						:key="source.name"
						:value="source.name"
					).p-1.text-center.text-lg.text-cupboardv2-dg.cursor-pointer.text-wrap.hover_bg-cupboardv2-lg
                        | {{ source.name }}  
        div(v-if="open").min-h-36
    // Review Cards
    div.flex.flex-col.gap-4.items-center
        V2InventoryReviewCardRectangle(
            v-for="item in changedItems"
            :key="item.id"
            :itemName="item.name"
            :itemCount="item.oldCount"
            :adjustedCount="item.newCount"
            :imgName="item.imgName"
        )
    // Footer Buttons
    div.flex.flex-row.gap-x-10.mt-32
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

// --Page navigations for each button--
// Goes back to the inventory page for the current category
const goBack = () => {
    navigateTo(`/v2/inventory/${categoryName}`)
}

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
