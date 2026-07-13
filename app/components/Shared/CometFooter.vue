<template>
	<UFooter class="bg-cancel-gray text-white">
		<div class="flex flex-col gap-8 py-6 sm:flex-row sm:items-start sm:justify-between">
			<img src="/CometCupboardLogo2.png" alt="Comet Cupboard" class="aspect-auto w-32" />

			<div class="space-y-2">
				<SharedTextBase class="font-bold text-white">Contact</SharedTextBase>
				<SharedTextBase class="text-white">{{ room }}</SharedTextBase>
				<SharedTextBase class="text-white">{{ userID }}</SharedTextBase>
				<SharedTextBase class="text-white">{{ phone }}</SharedTextBase>
			</div>

			<div class="space-y-2">
				<SharedTextBase class="font-bold text-white">Hours</SharedTextBase>

				<div>
					<SharedTextBase class="font-bold text-white">Monday, Wednesday, Friday</SharedTextBase>
					<SharedTextBase class="text-white">10 AM - 4 PM</SharedTextBase>
				</div>

				<div>
					<SharedTextBase class="font-bold text-white">Tuesday, Thursday</SharedTextBase>
					<SharedTextBase class="text-white">11 AM - 5 PM</SharedTextBase>
				</div>
			</div>

			<div class="space-y-2">
				<SharedTextBase class="font-bold text-white">Connect With Us</SharedTextBase>
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
