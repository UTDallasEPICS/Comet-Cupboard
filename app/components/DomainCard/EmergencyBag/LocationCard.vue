<template>
	<UCard>
		<div class="overflow-hidden rounded-lg border border-gray-200">
			<img :alt="locationName" :src="`/api/public/image/${imgName}`" class="h-44 w-full object-cover" />
			<UCollapsible>
				<template #default="{ open }">
					<SharedButtonActionButton
						color="neutral"
						variant="ghost"
						block
						class="h-auto justify-between rounded-none p-4"
						:trailing-icon="open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
					>
						<div class="min-w-0 text-left">
							<SharedTextCardTitle>{{ locationName }}</SharedTextCardTitle>
							<SharedTextBase class="mt-1 text-sm text-gray-600">Available Bags: {{ visibleBags.length }}</SharedTextBase>
						</div>
					</SharedButtonActionButton>
				</template>
				<template #content>
					<div class="space-y-4 border-t border-gray-200 p-4">
						<SharedTextBaseSecondary>{{ description }}</SharedTextBaseSecondary>
						<div class="space-y-2">
							<SharedTextBase class="font-semibold">Bag Labels</SharedTextBase>
							<div v-if="visibleBags.length" class="space-y-2">
								<div v-for="(bag, index) in visibleBags" :key="index" class="rounded-lg border border-gray-200 p-2">
									<div v-if="bag.emergencyBagLabels.length" class="flex flex-wrap gap-1">
										<UBadge
											v-for="label in bag.emergencyBagLabels"
											:key="label.emergencyBagLabelName"
											:label="label.emergencyBagLabelName"
											color="neutral"
											variant="outline"
										/>
									</div>
									<SharedTextBaseSecondary v-else>No labels</SharedTextBaseSecondary>
								</div>
							</div>
							<SharedTextBaseSecondary v-else>No available bags match the selected labels.</SharedTextBaseSecondary>
						</div>
						<div v-if="mapEmbedUrl" class="h-52 overflow-hidden rounded-lg border border-gray-200">
							<iframe
								:src="mapEmbedUrl"
								width="100%"
								height="100%"
								:title="locationName"
								scrolling="no"
								allow="geolocation; gyroscope; accelerometer"
								style="border: 0px solid #fff; margin: 0; padding: 0"
								class="block"
								loading="lazy"
							/>
						</div>
					</div>
				</template>
			</UCollapsible>
		</div>
	</UCard>
</template>

<script setup lang="ts">
defineProps<{
	locationName: string
	imgName: string
	description: string
	mapEmbedUrl?: string | null
	visibleBags: Array<{
		emergencyBagLabels: Array<{ emergencyBagLabelName: string }>
	}>
}>()
</script>
