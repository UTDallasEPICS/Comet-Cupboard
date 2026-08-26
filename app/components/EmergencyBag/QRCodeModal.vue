<template>
	<UModal>
		<SharedButtonActionButton icon="i-lucide-qr-code" button-variant="ghost" action="neutral" size="md" />
		<template #content>
			<SharedLayoutSectionUCard title="Submit Page for Emergency Bags">
				<img :src="qrCodeDataURL" alt="QR Code" class="mx-auto my-4 w-64" />
				<SharedTextBase class="text-center">
					This QR code links to the submit page for emergency bags at
					<NuxtLink :to="publicURL" class="text-primary hover:text-primary/80 underline underline-offset-2">
						{{ publicURL }}
					</NuxtLink>
				</SharedTextBase>
				<SharedTextBase> </SharedTextBase>
			</SharedLayoutSectionUCard>
		</template>
	</UModal>
</template>

<script setup lang="ts">
import QRCode from "qrcode"

const qrCodeDataURL = ref("")
const publicURL = ref("")

onMounted(async () => {
	publicURL.value = `${window.location.origin}/public/emergency-bag/qrcode`

	qrCodeDataURL.value = await QRCode.toDataURL(publicURL.value, {
		width: 512,
		margin: 2,
		errorCorrectionLevel: "H",
	})
})
</script>
