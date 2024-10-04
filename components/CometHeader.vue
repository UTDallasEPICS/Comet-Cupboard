<template lang="pug">
div.min-h-20.bg-utd-green.content-center
    div.mx-4.sm_mx-8.flex.flex-row
        div.sm_hidden.place-self-center.pr-8
            Bars3Icon.size-10.fill-white.cursor-pointer
        div.flex.flex-row.h-14.space-x-5.sm_space-x-14.items-center.w-full
            img.h-14(src="/CometCupboardLogo1.png")
            div.flex-grow.flex-row.space-x-10.overflow-x-scroll.items-center.left-left.text-3xl.font-bold.text-white.text-nowrap
                div.inline-flex.max-sm_hidden
                    NuxtLink(to="/shopping").cursor-pointer.text-nowrap
                        | Shopping
                div.inline-flex.max-sm_hidden
                    NuxtLink(to="/verify-carts").cursor-pointer.text-nowrap
                        | Verify Carts
                div.inline-flex.max-sm_hidden
                    NuxtLink(to="/inventory-management").cursor-pointer.text-nowrap
                        | Inventory Management
                div.inline-flex.max-sm_hidden
                    NuxtLink(to="/data").cursor-pointer.text-nowrap
                        | Data
            ShoppingBagIcon.size-10.min-w-10.fill-white.cursor-pointer.justify-self-right
            UserIcon.size-10.min-w-10.fill-white.cursor-pointer.justify-self-right
</template>

<script lang="ts" setup>
import { Bars3Icon, ShoppingBagIcon, UserIcon } from '@heroicons/vue/24/solid'

</script>
