<template lang="pug">
Menu
    div.relative
        MenuButton
            Bars3Icon.w-16.h-16.stroke-white
        MenuItems
            div.absolute.left-0.flex.flex-col.items-center.pb-4.gap-4.text-center.text-white.text-3xl.whitespace-nowrap(class="w-screen md:w-64" style="background-color: #8A7A67")
                MenuItem.min-w-full
                    NuxtLink(to="/catalog") Catalog
                MenuItem.min-w-full
                    NuxtLink(to="/donation") See Donations
                MenuItem.min-w-full
                    NuxtLink(to="/inventory/inventory") Inventory
                MenuItem.min-w-full
                    NuxtLink(to="/verify-cart") Verify Carts
                MenuItem.min-w-full
                    NuxtLink(to="/data-analytics") Data Analytics
</template>

<script lang="ts" setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue"
import { Bars3Icon } from "@heroicons/vue/24/outline"
</script>
