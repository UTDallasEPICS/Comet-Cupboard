<template>
	<UContainer class="py-8">
		<header>
			<SharedTextPageTitle>Admin Dashboard</SharedTextPageTitle>
		</header>

		<section class="mt-4">

			<div class="flex items-center justify-between w-full">

				<SharedTextSectionTitle>Admin Actions</SharedTextSectionTitle>

				<UButton icon="i-heroicons-question-mark-circle" color="gray" variant="ghost" label="Take a Tour"
					@click="startTour" />
			</div>

			<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<li v-for="link in adminLinks" :key="link.label" :id="link.label.toLowerCase().replace(/\s+/g, '-')">
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
import { AdminDashboardTour } from '../../utils/demo'

const adminLinks = roleLinks["admin"]
	.flatMap((link) => {
		if (link.children) {
			return link.children
		}
		return link
	})
	.filter((link) => {
		return link.label != "Dashboard"
	})

const { startTour } = AdminDashboardTour()

onMounted(() => {
	startTour()
})
</script>
