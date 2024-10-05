<template lang="pug">
div.min-h-20.bg-utd-green.content-center
    div.mx-4.sm_mx-8.flex.flex-row
        div(@click="mobileNav = !mobileNav").sm_hidden.place-self-center.pr-8
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
            div.flex.flex-row.space-x-5 
                ShoppingBagIcon.size-10.min-w-10.fill-white.cursor-pointer.justify-self-right
                UserIcon.size-10.min-w-10.fill-white.cursor-pointer.justify-self-right
div(v-show="mobileNav").absolute.z-20.flex-grow.mt-20.h-full.w-screen.bg-utd-green
    div(style="height: 2px").w-full.bg-white
    div.h-20.w-full.bg-utd-orange.content-center
        div.text-3xl.text-center.font-bold.text-white
            | Navigation
    div(style="height: 2px").w-full.bg-white
    div.mt-10.flex.flex-col.space-y-7.text-white
        div.flex.justify-center.text-2xl.font-semibold
            NuxtLink(to="/shopping", @click="mobileNav = false").cursor-pointer
                | Shopping
        div.flex.justify-center.text-2xl.font-bold
            NuxtLink(to="/verify-carts", @click="mobileNav = false").cursor-pointer
                | Verify Carts
        div.flex.justify-center.text-2xl.font-bold
            NuxtLink(to="/inventory-management", @click="mobileNav = false").cursor-pointer
                | Inventory Management
        div.flex.justify-center.text-2xl.font-bold
            NuxtLink(to="/data", @click="mobileNav = false").cursor-pointer
                | Data
</template>

<script lang="ts" setup>
import { Bars3Icon, ShoppingBagIcon, UserIcon } from '@heroicons/vue/24/solid'

const mobileNav = ref(false);

</script>
