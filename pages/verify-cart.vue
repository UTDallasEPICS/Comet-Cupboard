<template lang="pug">
div.flex.flex-row.my-8.flex-wrap.md_flex-nowrap.justify-center.md_justify-normal
    div.md_mr-6.lg_mr-12(:class="((currentCartIDPreview === 'No cart chosen') ? 'visible' : 'invisible hidden') + ' md_visible md_block'")
        p search
        PendingCartsList(:selectedCart="currentCartIDPreview" @update:select-cart="setCartIDPreview")
    XMarkIcon.ml-auto.size-10.stroke-black(:class="((currentCartIDPreview === 'No cart chosen') ? 'invisible hidden': 'visible') + ' md_invisible md_hidden'" @click="resetCartIDPreview")
    CartVerificationPreview(:class="((currentCartIDPreview === 'No cart chosen') ? 'invisible hidden': 'visible') + ' md_visible md_flex'" 
        :cartID="currentCartIDPreview" @update:verified-cart="resetCartIDPreview")
</template>

<script lang="ts" setup>
import { XMarkIcon } from '@heroicons/vue/24/solid'

const currentCartIDPreview = ref<string>("No cart chosen")

const setCartIDPreview = (cartID: string) => {
    // deselect cart if already chosen
    if(currentCartIDPreview.value === cartID) {
        currentCartIDPreview.value = "No cart chosen"
    }
    else {
        currentCartIDPreview.value = cartID
    }
}

const resetCartIDPreview = () => {
	currentCartIDPreview.value = "No cart chosen"
}
</script>
