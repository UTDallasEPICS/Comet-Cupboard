<template lang="pug">
div.flex.flex-row.my-8
    div.mr-24
        p search
        PendingCartsList(@update:select-cart="setCartIDPreview")
    CartVerificationPreview(:cartID="currentCartIDPreview" @update:verified-cart="resetCartIDPreview")
</template>

<script lang="ts" setup>
const currentCartIDPreview = ref<string>("No cart chosen")

const setCartIDPreview = (cartID: string) => {
	currentCartIDPreview.value = cartID
}

const resetCartIDPreview = () => {
	currentCartIDPreview.value = "No cart chosen"
}
</script>
