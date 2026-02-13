<template>
	<UContainer class="py-10">
		<div class="mb-8">
			<h1 class="text-3xl font-bold">Student Dashboard</h1>
		</div>

		<div class="mb-12">
			<h2 class="mb-4 text-xl font-semibold">Student Actions</h2>
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				<UCard v-for="link in studentLinks" :key="link.label" class="cursor-pointer transition hover:shadow-lg" @click="navigateTo(link.to)">
					<div class="flex items-center gap-4">
						<UIcon :name="link.icon" class="h-8 w-8" />
						<div>
							<h3 class="text-lg font-semibold">
								{{ link.label }}
							</h3>
							<p class="text-sm text-gray-500">
								{{ link.description }}
							</p>
						</div>
					</div>
				</UCard>
			</div>
		</div>
	</UContainer>
</template>

<script setup lang="ts">
const studentLinks = [
	{
		label: "Shop",
		description: "Browse available items",
		icon: "i-heroicons-shopping-cart",
		to: "/shop",
	},
	{
		label: "Queue",
		description: "Join or view your queue status",
		icon: "i-heroicons-clock",
		to: "/queue",
	},
	{
		label: "Emergency Bags",
		description: "View emergency bag options",
		icon: "i-heroicons-archive-box",
		to: "/emergency-bags",
	},
]
</script>
