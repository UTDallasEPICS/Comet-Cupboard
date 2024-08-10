<template lang="pug">
div.flex.flex-row(style="background-color: #154734")
    TopLeftNavigation
    NuxtLink(to="/catalog")
        img.h-16(src="/TemporaryCometCupboardTransparent.png")
    UserCircleIcon.w-16.h-16.stroke-white(style="margin-left: auto")
    NuxtLink(to="/cart")
        ShoppingCartIcon.w-16.h-16.stroke-white
</template>

<script lang="ts" setup>
import { ShoppingCartIcon, UserCircleIcon } from "@heroicons/vue/24/outline"
</script>
