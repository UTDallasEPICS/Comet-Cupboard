<template lang="pug">
div.min-h-20.bg-utd-green
    div.mx-8.flex.flex-row
        div.sm_hidden.place-self-center.pr-8
            | ham
        div.flex.flex-row.space-x-14.py-2.items-center.w-full
            img.h-14(src="/CometCupboardLogo1.png")
            div.max-sm_hidden.flex.flex-row.space-x-10.overflow-x-scroll.items-center.left-left.text-3xl.font-bold.text-white
                div.flex.text-nowrap
                    NuxtLink(to="/shopping").cursor-pointer
                        | Shopping
                div.flex.text-nowrap
                    NuxtLink(to="/verify-carts").cursor-pointer
                        | Verify Carts
                div.flex.text-nowrap
                    NuxtLink(to="/inventory-management").cursor-pointer
                        | Inventory Management
                div.flex.text-nowrap
                    NuxtLink(to="/data").cursor-pointer
                        | Data
            div.flex-grow.text-right
                |acc
</template>

<script lang="ts" setup>
</script>
