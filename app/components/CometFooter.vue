<template lang="pug">
div.bg-cupboard-dg
	div.mx-7.my-5.flex.flex-col.sm_flex-row.place-content-evenly.max-sm_space-y-7.sm_space-x-7.text-white
		div
			img(src="/CometCupboardLogo2.png").h-14
		div.space-y-1
			h2.text-2xl.font-bold
				| Contact
			div
				button(@click="handleRoom").space-x-1.text-left.remove-button-effects.text-base.font-normal
					p.font-bold.inline-flex
						| Location:
					p.inline-flex
						| {{ room }}
					div(v-show="roomCopied").inline-flex
						ClipboardDocumentCheckIcon.w-4.size4.fill-white
			div
				button(@click="handleEmail").space-x-1.text-left.remove-button-effects.text-base.font-normal
					p.font-bold.inline-flex
						| Email:
					p.inline-flex
						| {{ email }}
					div(v-show="emailCopied").inline-flex
						ClipboardDocumentCheckIcon.w-4.size4.fill-white
			div
				button(@click="handlePhone").space-x-1.text-left.remove-button-effects.text-base.font-normal
					p.font-bold.inline-flex
						| Phone
					p.inline-flex
						| {{ phone }}
					div(v-show="phoneCopied").inline-flex
						ClipboardDocumentCheckIcon.w-4.size4.fill-white
		div.space-y-1
			h2.text-2xl.font-bold
				| Hours
			div.space-y-3
				div
					p
						| Monday, Wednesday, Friday:
					p
						| 10 AM - 4 PM
				div
					p
						| Tuesday, Thursday:
					p
						| 11 AM - 5 PM
		div.space-y-1
			h2.text-2xl.font-bold
				| Connect With Us
			NuxtLink(:to="instagram")
				img(src="/instagramIcon.svg").h-10
</template>

<script setup lang="ts">
import { ClipboardDocumentCheckIcon } from "@heroicons/vue/24/solid"

const roomCopied = ref(false)
const emailCopied = ref(false)
const phoneCopied = ref(false)

const room = "MC 1.604"
const email = "cupboard@utdallas.edu"
const phone = "972-883-6613"
const instagram = "https://www.instagram.com/cometcupboard/"

// contact info copy user-feedback
const handleRoom = () => {
	navigator.clipboard.writeText(room)
	roomCopied.value = true
	setTimeout(roomAlert, 2500)
}
const roomAlert = () => {
	roomCopied.value = false
}
const handleEmail = () => {
	navigator.clipboard.writeText(email)
	emailCopied.value = true
	setTimeout(emailAlert, 2500)
}
const emailAlert = () => {
	emailCopied.value = false
}
const handlePhone = () => {
	navigator.clipboard.writeText(phone)
	phoneCopied.value = true
	setTimeout(phoneAlert, 2500)
}
const phoneAlert = () => {
	phoneCopied.value = false
}
</script>
