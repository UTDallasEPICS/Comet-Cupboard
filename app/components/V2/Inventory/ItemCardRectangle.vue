<template lang="pug">
Menu
    div.bg-white.h-24.rounded-xl.drop-shadow-standard.relative.w-full.max-w-xl
        // Deal tag on bottom right of card
        div.absolute.bottom-0.right-0.bg-utd-orange.text-white.text-xs.font-bold.px-2.rounded-br-md.rounded-tl-md(
            v-if="dealExists"
        ) {{ dealText }}
        
        // Settings/options button
        MenuButton.absolute.top-1.right-2.w-8.h-4.content-center.rounded-full
            div.flex.flex-row.space-x-1.justify-center
                div.w-1.h-1.bg-black.rounded-full
                div.w-1.h-1.bg-black.rounded-full
                div.w-1.h-1.bg-black.rounded-full

        // Wrap MenuItems in TransitionsPopUp, but forward slot content
        TransitionsPopUp
            MenuItems.absolute.top-5.right-2.bg-white.bg-opacity-90.drop-shadow-standard.rounded-md.py-2.px-6.z-50
                MenuItem
                    div(@click="editItem").flex.justify-center.items-center.px-1.py-1.cursor-pointer.border-b.border-cupboardv2-lg.text-lg.font-normal.hover_underline Edit
                MenuItem
                    div(@click="editDeal").flex.justify-center.items-center.px-1.py-1.cursor-pointer.border-b.border-cupboardv2-lg.text-lg.font-normal.hover_underline Item Deal
                MenuItem
                     div(@click="deleteItem").flex.justify-center.items-center.px-1.py-1.cursor-pointer.text-lg.font-normal.hover_underline Delete
        div.flex.items-center.justify-between.h-full
            // Text container (flex vertical)
            div.flex.flex-col.ml-5.gap-y-1
                // Item name and in stock
                p.text-base.text-cupboardv2-dg.font-semibold {{ itemName }}
                div.flex.gap-x-3.-translate-y-1
                    p.text-sm.text-cupboardv2-dg In Stock:
                    div.bg-white.w-24.h-5.border-cupboardv2-dg.rounded-xl.flex.justify-end.box-border.relative(class="border-[1px]")
                        div.flex.items-center.justify-center
                            span.text-sm.text-black.mr-2 {{ props.currentCount }}
                        div.bg-cupboardv2-elg.w-14.rounded-r-xl.flex.items-center.justify-center(:style="clipStyle")
                            span.text-sm.text-black {{ displayChange }}
                // Inventory adjustment buttons (flex horizontal)
                div.flex.gap-x-3
                    button(@click="decrement").w-5.h-5.bg-cupboardv2-dg.rounded-full.flex.items-center.justify-center
                        MinusIcon.w-4.h-4.text-white(class="stroke-[3px]")
                    div.relative.flex.flex-col.items-center
                        input.w-6.bg-transparent.outline-none.border-none.text-base.text-center.text-black(type="text" placeholder="#" v-model="adjustAmount" @input="validateInput")
                        div.bg-cupboardv2-dg.w-7.rounded-xl.-mt-1(class="h-[2px]")
                    button(@click="increment").w-5.h-5.bg-cupboardv2-dg.rounded-full.flex.items-center.justify-center
                        PlusIcon.w-4.h-4.text-white(class="stroke-[3px]")
            // Image container
            div.relative.w-14.h-14.flex-shrink-0.overflow-hidden.mr-8
                img.w-full.h-full.object-cover(v-if="imgName" :src="`/api/image/${imgName}`" :alt="itemName")
                PhotoIcon.w-full.h-full.txt-cupboardv2-dg(v-else)
</template>

<script lang="ts" setup>
import { MinusIcon } from '@heroicons/vue/24/outline'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { PhotoIcon } from '@heroicons/vue/24/outline'
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue"
import { useRoute, navigateTo } from '#imports' 

const props = defineProps({
    itemName: {
        type: String,
        default: "Item name",
    },
    imgName: {
        type: String,
        default: '',
    },
    currentCount: {
        type: Number,
        default: 0,
    },
    changeCount: {
        type: Number,
        default: 0,
    },
    itemDeal: {
        type: Object,
        default: () => ({}),
    },
    itemID: {
        type: String,
        required: true,
    },
})

const route = useRoute()
const categoryName = route.params.categoryName as string

const dealExists = computed(() => {
	return props.itemDeal.actualCount !== undefined && props.itemDeal.adjustedCount !== undefined
})

const dealText = computed(() => {
	if (!dealExists.value) {
		return ""
	}
	const a = props.itemDeal.actualCount 
    const b = props.itemDeal.adjustedCount 

    if(a === 1 && b === 0) return "FREE"

    return `${a} for ${b}`
})

const emit = defineEmits<{
    (e: 'changeAmountUpdate', itemID: string, amountChange: number): void 
}>()

// Per-click adjustment amount based on input
const adjustAmount = ref<string>('1')

// Functions for emits
function increment() {
    const step = parseInt(adjustAmount.value) || 0
    if(step <= 0) return 
    emit('changeAmountUpdate', props.itemID, step)
}

function decrement() {
    const step = parseInt(adjustAmount.value) || 0
    if(step <= 0) return 
    emit('changeAmountUpdate', props.itemID, -step)
}

// Menu Navigators
function editItem() {
    navigateTo(`/v2/inventory/${categoryName}/${props.itemID}/edit`)
}

function deleteItem() {
    navigateTo(`/v2/inventory/${categoryName}/${props.itemID}/delete`)
}

function editDeal() {
    navigateTo(`/v2/inventory/${categoryName}/${props.itemID}/deal`)
}

const displayChange = computed(() => {
    const c = Number(props.changeCount || 0)
    return c > 0 ? `+${c}` : `${c}`
})

// Input validation so input is between 0-99 only
function validateInput(e: Event) {
    const input = (e.target as HTMLInputElement).value 
    // Remove any non-digit characters from the input
    let digitsOnly = '';
    for(const char of input) {
        if(char >= '0' && char <= '9') {
            digitsOnly += char;
        }
    }
    adjustAmount.value = digitsOnly === '' ? '' : Math.min(99, Number(digitsOnly)).toString()
}

// Creates a diagonal line styling with specified percentages to adjust the angle
const clipStyle = 'clip-path: polygon(30% 0, 100% 0, 100% 100%, 0 100%)'
</script>