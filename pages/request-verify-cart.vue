<template lang="pug">
div(class="sm:flex sm:flex-row sm:flex-nowrap")
    NavLinkButton.w-36.h-min.whitespace-nowrap(class="sm:flex-grow-0" to="/catalog")
        p Back to Items
    div(class="sm:flex-grow")
        p.text-6xl.text-center My Cart
        div.relative(style="margin-left: auto; margin-right: auto;")
            CartItemsGrid(class="grid-cols-1 lg:grid-cols-2" :editMode="false")
    div.w-72
        p put info here idk
        ActionButton.block.w-72.h-min(class="sm:flex-grow-0" style="margin-left: auto; margin-right: auto;" @click="requestCartVerification")
            p Request Cart Verification
</template>

<script lang="ts" setup>
const requestCartVerification = async () => {
	await $fetch("/api/verification/cartRequestVerification", {
		method: "POST",
	})
}
</script>
