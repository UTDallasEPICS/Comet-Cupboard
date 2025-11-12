<template lang="pug">
div.bg-white.w-80.h-80.rounded-xl.flex.flex-col.items-center.gap-3.justify-top.drop-shadow-standard.relative
    // Settings/options button
    button.absolute.top-5.right-5.flex.items-center.justify-center
        span.flex.gap-1
            span.w-2.h-2.bg-cupboardv2-dg.rounded-full
            span.w-2.h-2.bg-cupboardv2-dg.rounded-full
            span.w-2.h-2.bg-cupboardv2-dg.rounded-full
    // Image container
    div.relative.w-24.h-24.flex-shrink-0.overflow-hidden.mt-8
        img.w-full.h-full.object-cover(v-if="imageSrc" :src="imageSrc" :alt="itemName")
        PhotoIcon.w-full.h-full.txt-cupboardv2-dg(v-else)
    // Text container (flex vertical)
    div.flex.flex-col.items-center.gap-4
        // Item name and in stock
        p.text-2xl.text-cupboardv2-dg.font-semibold {{ itemName }}
        div.flex.gap-3
            p.text-base.text-cupboardv2-dg In Stock:
            div.bg-white.h-8.border-2.border-cupboardv2-dg.rounded-2xl.flex.justify-end.box-border.relative(class="w-[150px]")
                div.flex.items-center.justify-center
                    span.text-base.text-black.mr-4 {{ props.currentCount }}
                div.bg-cupboardv2-elg.rounded-r-2xl.flex.items-center.justify-center(:style="clipStyle")(class="w-[88px]")
                    span.text-base.text-black {{ displayChange }}
        // Inventory adjustment buttons (flex horizontal)
        div.flex.gap-6.mt-2
            button(@click="decrement").w-10.h-10.bg-cupboardv2-dg.rounded-full.flex.items-center.justify-center
                MinusIcon.w-8.h-8.text-white(class="stroke-[3px]")
            div.relative.flex.flex-col.items-center.mt-3
                input.bg-transparent.w-12.-mb-1.outline-none.border-none.text-2xl.text-center.text-black(type="text" placeholder="#" v-model="adjustAmount" @input="validateInput")
                div.bg-cupboardv2-dg.w-12.h-1.rounded-xl
            button(@click="increment").w-10.h-10.bg-cupboardv2-dg.rounded-full.flex.items-center.justify-center
                PlusIcon.w-8.h-8.text-white(class="stroke-[3px]")
</template>

<script lang="ts" setup>
import { MinusIcon } from '@heroicons/vue/24/outline'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { PhotoIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
    itemName: {
        type: String,
        default: "Item name",
    },
    imageSrc: {
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

const emit = defineEmits<{
    (e: 'changeAmountUpdate', itemID: string, amountChange: number): void 
    (e: 'editItem', itemID: string): void
    (e: 'deleteItem', itemID: string): void 
    (e: 'editDeal', itemID: string): void
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

function editItem() {
    emit('editItem', props.itemID)
}

function deleteItem() {
    emit('deleteItem', props.itemID)
}

function editDeal() {
    emit('editDeal', props.itemID)
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
