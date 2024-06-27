<template lang="pug">
div.bg-gray-600.flex.flex-row(style="background-color: #154734")
    TopLeftNavigation
    NuxtLink(to="/catalog")
        img(style="height: 60px" src="/TemporaryCometCupboardTransparent.png")
    UserCircleIcon.w-16.h-16.stroke-white(style="margin-left: auto")
    NuxtLink(to="/cart")
        ShoppingCartIcon.w-16.h-16.stroke-white
</template>

<script lang="ts" setup>
import { ShoppingCartIcon, UserCircleIcon } from "@heroicons/vue/24/outline"
</script>
