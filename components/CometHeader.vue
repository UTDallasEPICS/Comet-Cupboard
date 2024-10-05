<template lang="pug">
div.sticky.top-0.z-50.min-h-20.overscroll-none.bg-utd-green.content-center
    div.mx-4.sm_mx-8.flex.flex-row
        div(@click="mobileNav = !mobileNav").sm_hidden.place-self-center.pr-8
            Bars3Icon.size-11.fill-white.stroke-white.cursor-pointer
        div.flex.flex-row.h-14.space-x-5.sm_space-x-14.items-center.w-full
            img.h-14(src="/CometCupboardLogo1.png")
            div.flex-grow.flex-row.space-x-10.overflow-x-scroll.items-center.left-left.text-3xl.font-bold.text-white.text-nowrap
                div(v-if="accessCookie === 'STUDENT' || accessCookie === 'VOLUNTEER'").inline-flex.max-sm_hidden
                    NuxtLink(to="/shopping").cursor-pointer.text-nowrap
                        | Shopping
                div(v-if="accessCookie === 'VOLUNTEER' || accessCookie === 'ADMIN'").inline-flex.max-sm_hidden
                    NuxtLink(to="/verify-cart").cursor-pointer.text-nowrap
                        | Verify Carts
                div(v-if="accessCookie === 'VOLUNTEER' || accessCookie === 'ADMIN'").inline-flex.max-sm_hidden
                    NuxtLink(to="/inventory-management").cursor-pointer.text-nowrap
                        | Inventory Management
                div(v-if="accessCookie === 'ADMIN'").inline-flex.max-sm_hidden
                    NuxtLink(to="/data").cursor-pointer.text-nowrap
                        | Data
            div.flex.flex-row.space-x-5 
                button(v-if="page === '/shopping'")
                    ShoppingBagIcon.size-10.min-w-10.fill-white.justify-self-right
                //button
                NuxtLink(to="/").cursor-pointer
                    UserIcon.size-10.min-w-10.fill-white.justify-self-right
div(v-show="mobileNav").sticky.top-20.z-40.flex-grow.h-screen.w-screen.bg-utd-green
    div(style="height: 2px").w-full.bg-white
    div.h-20.w-full.bg-utd-orange.content-center
        div.text-3xl.text-center.font-bold.text-white
            | Navigation
        button(@click="mobileNav = false").absolute.top-5.right-5
            XMarkIcon.size-10.fill-white.stroke-white
    div(style="height: 2px").w-full.overflow-y-clip.overscroll-none.bg-white
    div.mt-10.flex.flex-col.space-y-7.text-white
        div(v-if="accessCookie === 'STUDENT' || accessCookie === 'VOLUNTEER'").flex.justify-center.text-2xl.font-semibold
            NuxtLink(to="/shopping", @click="mobileNav = false").cursor-pointer
                | Shopping
        div(v-if="accessCookie === 'VOLUNTEER' || accessCookie === 'ADMIN'").flex.justify-center.text-2xl.font-semibold
            NuxtLink(to="/verify-cart", @click="mobileNav = false").cursor-pointer
                | Verify Carts
        div(v-if="accessCookie === 'VOLUNTEER' || accessCookie === 'ADMIN'").flex.justify-center.text-2xl.font-semibold
            NuxtLink(to="/inventory-management", @click="mobileNav = false").cursor-pointer
                | Inventory Management
        div(v-if="accessCookie === 'ADMIN'").flex.justify-center.text-2xl.font-semibold
            NuxtLink(to="/data", @click="mobileNav = false").cursor-pointer
                | Data
</template>

<script lang="ts" setup>
import { AccessLevel } from "~/permissions"
import { Bars3Icon, ShoppingBagIcon, UserIcon, XMarkIcon } from '@heroicons/vue/24/solid'

const accessCookie = useCookie("accessLevel");

const mobileNav = ref(false);

const route = useRoute();
const page = ref(route.fullPath);
watch(route, () => {
    console.log('refreshed header route');
    page.value = route.fullPath;
});

</script>
