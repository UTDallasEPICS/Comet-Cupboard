<template lang="pug">
div.flex.flex-row(class="mx-8 my-8 lg:mx-48")
    //- div.mr-20
    //-     p search
    //-     PendingCartsList(@update:select-cart="setCartIDPreview")
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
