<template>
	<UCard>
		<!-- Location information - always visible -->
		<div class="flex flex-row items-center gap-4 p-4">
			<img :alt="locationName" :src="`/api/public/image/${imgName}`" class="mb-auto aspect-square w-20 rounded-lg object-cover" />
			<div class="flex flex-col gap-2">
				<SharedTextCardTitle>{{ locationName }}</SharedTextCardTitle>
				<SharedTextBaseSecondary>{{ description }}</SharedTextBaseSecondary>
				<SharedTextBaseSecondary> Available Bags: {{ visibleBags.length }} </SharedTextBaseSecondary>
			</div>
		</div>
		<UCollapsible>
			<template #default="{ open }">
				<SharedButtonActionButton
					action="neutral"
					button-variant="ghost"
					block
					class="h-auto justify-between rounded-none border-t border-gray-200 p-4"
					:trailing-icon="open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
				>
					<SharedTextBase class="font-semibold"> Available Bags </SharedTextBase>
				</SharedButtonActionButton>
			</template>

			<template #content>
				<div class="space-y-4 p-4">
					<div class="space-y-2">
						<div v-if="visibleBags.length" class="space-y-2">
							<div v-for="(bag, index) in visibleBags" :key="index" class="rounded-lg border border-gray-200 p-2">
								<div v-if="bag.emergencyBagLabels.length" class="flex flex-wrap gap-1">
									<SharedLabel
										v-for="label in bag.emergencyBagLabels"
										:key="label.emergencyBagLabelName"
										:label="label.emergencyBagLabelName"
										:color="label.color"
									/>
								</div>

								<SharedTextBaseSecondary v-else> No labels </SharedTextBaseSecondary>
							</div>
						</div>

						<SharedTextBaseSecondary v-else> No available bags match the selected labels. </SharedTextBaseSecondary>
					</div>
				</div>
			</template>
		</UCollapsible>
		<UCollapsible v-if="mapEmbedUrl">
			<template #default="{ open }">
				<SharedButtonActionButton
					action="neutral"
					button-variant="ghost"
					block
					class="h-auto justify-between rounded-none border-t border-gray-200 p-4"
					:trailing-icon="open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
				>
					<SharedTextBase class="font-semibold"> {{ open ? "Hide Map" : "Show Map" }} </SharedTextBase>
				</SharedButtonActionButton>
			</template>

			<template #content>
				<div class="p-4">
					<div class="h-96 overflow-hidden rounded-lg border border-gray-200">
						<iframe
							:src="mapEmbedUrl"
							width="100%"
							height="100%"
							:title="`${locationName} Map`"
							scrolling="no"
							allow="geolocation; gyroscope; accelerometer"
							class="block border-0"
							loading="lazy"
						/>
					</div>
				</div>
			</template>
		</UCollapsible>
	</UCard>
</template>

<script setup lang="ts">
defineProps<{
	locationName: string
	imgName: string
	description: string
	mapEmbedUrl?: string | null
	visibleBags: Array<{
		emergencyBagLabels: Array<{ emergencyBagLabelName: string; color: string }>
	}>
}>()
</script>
