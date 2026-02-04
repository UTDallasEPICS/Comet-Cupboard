<template>
	<div class="bg-cupboard-dg">
		<div class="mx-7 my-5 flex flex-col place-content-evenly text-white max-sm:space-y-7 sm:flex-row sm:space-x-7">
			<div>
				<img src="/CometCupboardLogo2.png" class="h-14" />
			</div>
			<div class="space-y-1">
				<h2 class="text-2xl font-bold">Contact</h2>
				<div>
					<button @click="handleRoom" class="remove-button-effects space-x-1 text-left text-base font-normal">
						<p class="inline-flex font-bold">Location:</p>
						<p class="inline-flex">{{ room }}</p>
						<div v-show="roomCopied" class="inline-flex">
							<ClipboardDocumentCheckIcon class="size4 w-4 fill-white" />
						</div>
					</button>
				</div>
				<div>
					<button @click="handleEmail" class="remove-button-effects space-x-1 text-left text-base font-normal">
						<p class="inline-flex font-bold">Email:</p>
						<p class="inline-flex">{{ email }}</p>
						<div v-show="emailCopied" class="inline-flex">
							<ClipboardDocumentCheckIcon class="size4 w-4 fill-white" />
						</div>
					</button>
				</div>
				<div>
					<button @click="handlePhone" class="remove-button-effects space-x-1 text-left text-base font-normal">
						<p class="inline-flex font-bold">Phone</p>
						<p class="inline-flex">{{ phone }}</p>
						<div v-show="phoneCopied" class="inline-flex">
							<ClipboardDocumentCheckIcon class="size4 w-4 fill-white" />
						</div>
					</button>
				</div>
			</div>
			<div class="space-y-1">
				<h2 class="text-2xl font-bold">Hours</h2>
				<div class="space-y-3">
					<div>
						<p>Monday, Wednesday, Friday:</p>
						<p>10 AM - 4 PM</p>
					</div>
					<div>
						<p>Tuesday, Thursday:</p>
						<p>11 AM - 5 PM</p>
					</div>
				</div>
			</div>
			<div class="space-y-1">
				<h2 class="text-2xl font-bold">Connect With Us</h2>
				<NuxtLink :to="instagram">
					<img src="/instagramIcon.svg" class="h-10" />
				</NuxtLink>
			</div>
		</div>
	</div>
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
