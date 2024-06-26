<template lang="pug">
Menu
    div.relative.text-center.text-white.text-4xl
        MenuButton
            Bars3Icon.w-16.h-16.stroke-white
        MenuItems
            div.absolute.left-0.flex.flex-col.w-64.divide-y(style="background-color: #8A7A67")
                MenuItem
                    NuxtLink(to="/catalog") 
                        p Catalog
                MenuItem
                    NuxtLink(to="/donation") 
                        p See Donations
                MenuItem
                    NuxtLink(to="/inventory") 
                        p Inventory
                MenuItem
                    NuxtLink(to="/verify-cart") 
                        p Verify Carts
                MenuItem
                    NuxtLink(to="/data-analytics") 
                        p Data Analytics
</template>

<script lang="ts" setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue"
import { Bars3Icon } from "@heroicons/vue/24/solid"
</script>