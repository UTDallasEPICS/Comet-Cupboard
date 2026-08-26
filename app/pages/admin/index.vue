<template>
	<div>
		<NuxtLayout name="main" title="Admin Dashboard" :tutorial-data="tutorialData">
			<USeparator class="my-4" />
			<section>
				<SharedLayoutGrid class="mt-4">
					<li v-for="link in adminLinks" :key="link.label">
						<DomainCardDashboardDefaultLinkCard :to="link.to" :icon="link.icon" :label="link.label" :description="link.description" />
					</li>
				</SharedLayoutGrid>
			</section>
			<template v-if="customAdminLinks.length > 0">
				<USeparator class="my-4" />
				<SharedTextSectionTitle>Custom Links</SharedTextSectionTitle>
				<section>
					<SharedLayoutGrid class="mt-4">
						<li v-for="link in customAdminLinks" :key="link.label">
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

const { data: customAdminLinks } = await useFetch("/api/admin/dashboard-links")
const { data: tutorialData } = await useFetch("/api/admin/tutorial")
</script>
