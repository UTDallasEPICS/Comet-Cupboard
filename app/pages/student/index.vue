<template>
	<UContainer class="py-8">
		<header>
			<SharedTextPageTitle>Student Dashboard</SharedTextPageTitle>
		</header>

		<section class="mt-4">
			<SharedTextSectionTitle>Student Actions</SharedTextSectionTitle>

			<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<li v-for="link in studentLinks" :key="link.label" :id="link.label.toLowerCase()">
					<UButton :to="link.to" class="border-final-border-soft w-full border bg-white p-4 shadow-md">
						<div class="flex items-center gap-4">
							<UIcon :name="link.icon" class="text-final-text-soft h-8 w-8" />
							<div class="flex flex-col">
								<SharedTextCardTitle>{{ link.label }}</SharedTextCardTitle>
								<SharedTextBase class="text-nowrap">{{ link.description }}</SharedTextBase>
							</div>
						</div>
					</UButton>
				</li>
			</ul>
		</section>
	</UContainer>
</template>

<script setup lang="ts">
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { onMounted } from 'vue'

const studentLinks = roleLinks["student"]
	.flatMap((link) => {
		if (link.children) {
			return link.children
		}
		return link
	})
	.filter((link) => {
		return link.label != "Dashboard"
	})

onMounted(() => {
	const driverObj = driver({
		showProgress: false, //turn off the 1 of 2 box
		steps: [
			{
				element: '#queue',
				popover: {
					title: 'Queue',
					description: 'Join the queue here to get access to the food pantry. You can also check your current position in the queue.',
					side: 'bottom',
				}
			},
			{
				element: '#shopping',
				popover: {
					title: 'Shopping',
					description: 'Browse available food and household items here. Add items to your cart and submit your order.',
					side: 'bottom',
				}
			},
		]
	})

	driverObj.drive()
})
</script>
