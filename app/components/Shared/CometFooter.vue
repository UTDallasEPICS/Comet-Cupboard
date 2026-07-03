<template>
	<UFooter class="bg-cancel-gray text-white">
		<div class="flex flex-col gap-8 py-6 sm:flex-row sm:items-start sm:justify-between">
			<img src="/CometCupboardLogo2.png" alt="Comet Cupboard" class="w-32 aspect-auto" />

			<div class="space-y-2">
				<p class="font-bold">Contact</p>
				<p>{{ room }}</p>
				<p>{{ userID }}</p>
				<p>{{ phone }}</p>
			</div>

			<div class="space-y-2">
				<p class="font-bold">Hours</p>

				<div>
					<p class="font-bold">Monday, Wednesday, Friday</p>
					<p>10 AM - 4 PM</p>
				</div>

				<div>
					<p class="font-bold">Tuesday, Thursday</p>
					<p>11 AM - 5 PM</p>
				</div>
			</div>

			<div class="space-y-2">
				<p class="font-bold">Connect With Us</p>
				<ULink :to="instagram">
					<UIcon :name="icons['instagram']" class="size-6 text-white" />
				</ULink>
			</div>
		</div>
	</UFooter>
</template>

<script setup lang="ts">
const room = "Location: MC 1.604"
const userID = "UserID: cupboard@utdallas.edu"
const phone = "Phone: 972-883-6613"
const instagram = "https://www.instagram.com/cometcupboard/"
</script>
