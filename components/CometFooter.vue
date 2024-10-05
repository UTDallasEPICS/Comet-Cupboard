<template lang="pug">
div.bg-cupboard-dg
    div.mx-7.my-5.flex.flex-col.sm_flex-row.place-content-evenly.max-sm_space-y-7.sm_space-x-7.text-white
        div
            img.h-14(src="/CometCupboardLogo2.png")
        div.space-y-1
            h2.text-2xl.font-bold
                |Contact
            div
                button(@click="handleRoom").space-x-1.cursor-pointer
                    p.font-bold.inline-flex
                        |Location: 
                    p.inline-flex
                        |MC 1.604
                    div(v-show="roomCopied").inline-flex
                        ClipboardDocumentCheckIcon.w-4.size4.fill-white
            div
                button(@click="handleEmail").space-x-1.cursor-pointer
                    p.font-bold.inline-flex
                        |Email: 
                    p.inline-flex
                        |cupbaord@utdallas.edu
                    div(v-show="emailCopied").inline-flex
                        ClipboardDocumentCheckIcon.w-4.size4.fill-white
            div
                button(@click="handlePhone").space-x-1.cursor-pointer
                    p.font-bold.inline-flex
                        |Phone
                    p.inline-flex
                        |972-883-6613
                    div(v-show="phoneCopied").inline-flex
                        ClipboardDocumentCheckIcon.w-4.size4.fill-white
        div.space-y-1
            h2.text-2xl.font-bold
                |Hours
            div.space-y-3
                div
                    p
                        |Monday, Wednesday, Friday:
                    p
                        |10 AM - 4 PM
                div
                    p
                        |Tuesday, Thursday:
                    p
                        |11 AM - 5 PM
        div.space-y-1
            h2.text-2xl.font-bold
                |Connect With Us
            NuxtLink(to="https://www.instagram.com/cometcupboard/")
                img(src="/instagramIcon.svg").h-10
</template>

<script setup lang="ts">

import { ClipboardDocumentCheckIcon } from '@heroicons/vue/24/solid'

const room = "MC 1.604"
const email = "cupboard@utdallas.edu"
const phone = "972-883-6613"
const instagram = "https://www.instagram.com/cometcupboard/"

let roomMessageTimeout;
const roomCopied = ref(false);
function handleRoom() {
    navigator.clipboard.writeText(room);
    roomCopied.value = true;
    roomMessageTimeout = setTimeout(roomAlert, 2500);
}
function roomAlert() {
    roomCopied.value = false;
}

let emailMessageTimeout;
const emailCopied = ref(false);
function handleEmail() {
    navigator.clipboard.writeText(email);
    emailCopied.value = true;
    emailMessageTimeout = setTimeout(emailAlert, 2500);
}
function emailAlert() {
    emailCopied.value = false;
}

let phoneMessageTimeout;
const phoneCopied = ref(false);
function handlePhone() {
    navigator.clipboard.writeText(phone);
    phoneCopied.value = true;
    phoneMessageTimeout = setTimeout(phoneAlert, 2500);
}
function phoneAlert() {
    phoneCopied.value = false;
}

function handleInstagram() {
    window.open(instagram)
}

</script>
