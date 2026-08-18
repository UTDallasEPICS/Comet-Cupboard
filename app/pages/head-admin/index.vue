<template>
	<div>
		<NuxtLayout name="main" :tutorial-data="tutorialData">
			<div class="flex flex-row items-center gap-2">
				<SharedTextPageTitle> Head Admin Dashboard </SharedTextPageTitle>
				<SharedTutorial v-if="tutorialData" :tutorial="tutorialData">
					<UButton :icon="icons['information']" color="neutral" variant="ghost" />
				</SharedTutorial>
			</div>
			<USeparator class="my-4" />
			<section>
				<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<li v-for="link in headAdminLinks" :key="link.label">
						<UButton :to="link.to" class="border-border-soft w-full border bg-white p-4 shadow-md">
							<div class="flex items-center gap-4">
								<UIcon :name="link.icon" class="text-text-soft h-8 w-8" />
								<div class="flex flex-col">
									<SharedTextCardTitle>{{ link.label }}</SharedTextCardTitle>
									<SharedTextBase class="text-nowrap">{{ link.description }}</SharedTextBase>
								</div>
							</div>
						</UButton>
					</li>
				</ul>
			</section>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const headAdminLinks = roleLinks["headAdmin"]
	.flatMap((link) => {
		if (link.children) {
			return link.children
		}
		return link
	})
	.filter((link) => {
		return link.label != "Dashboard"
	})

const { data: tutorialData } = await useTutorialForGroup("Head Admin")
</script>
