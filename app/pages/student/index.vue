<template>
	<div>
		<NuxtLayout name="main" title="Student Dashboard" :tutorial-data="tutorialData">
			<USeparator class="my-4" />
			<section>
				<SharedLayoutGrid class="mt-4">
					<li v-for="link in studentLinks" :key="link.label">
						<DomainCardDashboardDefaultLinkCard :to="link.to" :icon="link.icon" :label="link.label" :description="link.description" />
					</li>
				</SharedLayoutGrid>
			</section>
			<template v-if="customStudentLinks.length > 0">
				<USeparator class="my-4" />
				<SharedTextSectionTitle>Custom Links</SharedTextSectionTitle>
				<section>
					<SharedLayoutGrid class="mt-4">
						<li v-for="link in customStudentLinks" :key="link.label">
							<DomainCardDashboardCustomLinkCard
								:dashboardLinkID="link.dashboardLinkID"
								:url="link.url"
								:display-name="link.displayName"
								:description="link.description"
							/>
						</li>
					</SharedLayoutGrid>
				</section>
			</template>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

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

const { data: customStudentLinks } = await useFetch("/api/student/dashboard-links")
const { data: tutorialData } = await useFetch("/api/student/tutorial")
</script>
