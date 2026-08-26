<template>
	<div>
		<NuxtLayout name="main" title="Head Admin Dashboard" :tutorial-data="tutorialData">
			<USeparator class="my-4" />
			<section>
				<SharedLayoutGrid class="mt-4">
					<li v-for="link in headAdminLinks" :key="link.label">
						<DomainCardDashboardDefaultLinkCard :to="link.to" :icon="link.icon" :label="link.label" :description="link.description" />
					</li>
				</SharedLayoutGrid>
			</section>
			<template v-if="customHeadAdminLinks.length > 0">
				<USeparator class="my-4" />
				<SharedTextSectionTitle>Custom Links</SharedTextSectionTitle>
				<section>
					<SharedLayoutGrid class="mt-4">
						<li v-for="link in customHeadAdminLinks" :key="link.label">
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

const { data: customHeadAdminLinks } = await useFetch("/api/head-admin/dashboard-links")
const { data: tutorialData } = await useFetch("/api/head-admin/tutorial")
</script>
